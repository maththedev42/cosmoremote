#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import math
import re
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "screenshots"
OUT = ROOT / "out" / "screenshots"
DATA_TS = ROOT / "src" / "generated" / "landing-data.ts"

LOCALES = {
    "en": [
        ("Your Mac Terminal\nIn Your Pocket", "Run Claude Code and Codex\nfrom your Android"),
        ("Scan and Pair\nStart Coding", "QR pairing connects your Android\nto your Mac instantly"),
        ("Live Streaming\nToken by Token", "Watch code appear live\nwith no polling or waiting"),
        ("Multiple Sessions\nAt Once", "Run Claude and Codex side by side\neach in its own session"),
        ("Syntax Highlighting\nCopy Any Block", "Readable code output\nwith one-tap copy"),
    ],
    "pt-BR": [
        ("O Terminal do seu\nMac\nNo Seu Bolso", "Execute o Claude Code e o Codex\ndo seu Android"),
        ("Vincule seu QR\nCode e comece", "Conexão por QR Code conecta seu\nAndroid ao seu Mac instantaneamente"),
        ("Streaming em Tempo\nReal\nToken por Token", "Veja o código aparecer ao vivo via\nWebSocket - sem polling, sem espera"),
        ("Execute várias\nsessões\nsimultaneamente", "Claude e Codex lado a lado, cada um\nem sua própria sessão"),
        ("Sintaxe correta,\ncopie fácil qualquer\nmensagem", "Saída de código bonita com cópia com\num clique para a área de transferência"),
    ],
    "es": [
        ("Terminal de Mac\nEn tu bolsillo", "Ejecuta Claude Code y Codex\ndesde tu Android"),
        ("Escanea y conecta\nEmpieza a programar", "El QR enlaza tu Android\ncon tu Mac al instante"),
        ("Streaming en vivo\nToken por token", "Mira el codigo aparecer\nsin polling ni esperas"),
        ("Varias sesiones\nA la vez", "Claude y Codex en paralelo\ncada uno en su sesion"),
        ("Copia cualquier bloque", "Codigo resaltado\ny un toque para copiar"),
    ],
}

SIZES = {
    "android-phone": (1080, 2400),
    "android-tablet-7": (1200, 1920),
    "android-tablet-10": (1600, 2560),
}

FONT = "/System/Library/Fonts/SFNS.ttf"
MONO = "/System/Library/Fonts/SFNSMono.ttf"


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT, size=size)


def mono(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(MONO, size=size)


def text(draw: ImageDraw.ImageDraw, xy, s, fnt, fill, anchor=None, stroke_width=0):
    draw.text(xy, s, font=fnt, fill=fill, anchor=anchor, stroke_width=stroke_width, stroke_fill=fill)


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    return mask


def paste_with_shadow(base: Image.Image, layer: Image.Image, xy: tuple[int, int], blur=28, alpha=80):
    shadow = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    shadow.putalpha(layer.getchannel("A").filter(ImageFilter.GaussianBlur(blur)).point(lambda p: min(p, alpha)))
    base.alpha_composite(shadow, (xy[0], xy[1] + 24))
    base.alpha_composite(layer, xy)


def draw_status(draw: ImageDraw.ImageDraw, w: int, scale=1.0):
    s = int(34 * scale)
    text(draw, (int(70 * scale), int(72 * scale)), "09:41", font(s), (13, 17, 29))
    x = w - int(290 * scale)
    text(draw, (x, int(72 * scale)), "5G", font(s), (13, 17, 29))
    for i, h in enumerate([14, 20, 27, 35]):
        draw.rounded_rectangle(
            (x + int((72 + i * 18) * scale), int((78 - h) * scale), x + int((82 + i * 18) * scale), int(78 * scale)),
            radius=int(4 * scale),
            fill=(13, 17, 29),
        )
    draw.rounded_rectangle((w - int(112 * scale), int(44 * scale), w - int(38 * scale), int(76 * scale)), radius=int(11 * scale), fill=(13, 17, 29))
    draw.rounded_rectangle((w - int(34 * scale), int(53 * scale), w - int(28 * scale), int(67 * scale)), radius=int(3 * scale), fill=(13, 17, 29))


def nav_bar(draw: ImageDraw.ImageDraw, w: int, h: int, selected: str):
    y = h - 205
    draw.rectangle((0, y - 22, w, h), fill=(255, 255, 255))
    items = [("Claude", "▣", "claude"), ("Codex", "<>", "codex"), ("Settings", "⚙", "settings")]
    for i, (label, icon, key) in enumerate(items):
        cx = int(w * (i + 0.5) / 3)
        active = key == selected
        if active:
            draw.rounded_rectangle((cx - 86, y + 8, cx + 86, y + 74), radius=34, fill=(235, 221, 255))
        text(draw, (cx, y + 42), icon, mono(40), (17, 24, 39), anchor="mm", stroke_width=1 if active else 0)
        text(draw, (cx, y + 116), label, font(32), (17, 24, 39), anchor="mm", stroke_width=1 if active else 0)
    draw.rounded_rectangle((w // 2 - 145, h - 35, w // 2 + 145, h - 25), radius=5, fill=(38, 38, 38))


def app_header(draw: ImageDraw.ImageDraw, w: int, title: str, subtitle: str, plus=True, y=130):
    draw.ellipse((58, y + 18, 82, y + 42), fill=(239, 71, 58))
    text(draw, (112, y), title, font(40), (17, 24, 39), stroke_width=1)
    text(draw, (112, y + 52), subtitle, mono(30), (80, 91, 111))
    if plus:
        text(draw, (w - 74, y + 30), "+", font(58), (17, 24, 39), anchor="mm")
    draw.rectangle((0, y + 132, w, y + 136), fill=(238, 242, 244))


def session_row(draw, box, title_s, preview, path, mac, status="IDLE", running=False):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle(box, radius=34, fill=(255, 255, 255), outline=(224, 229, 232), width=2)
    dot = (40, 209, 112) if running else (93, 173, 226)
    draw.ellipse((x0 + 34, y0 + 50, x0 + 62, y0 + 78), fill=dot)
    text(draw, (x0 + 94, y0 + 44), title_s, font(38), (17, 24, 39), stroke_width=1)
    text(draw, (x1 - 44, y0 + 56), "▱ " + mac, mono(26), (82, 93, 112), anchor="ra")
    text(draw, (x0 + 94, y0 + 108), preview, font(31), (80, 91, 111))
    text(draw, (x0 + 94, y0 + 162), "■ " + path, mono(29), (143, 153, 166))
    pill_w = 150 if running else 110
    fill = (211, 249, 225) if running else (226, 244, 255)
    col = (37, 188, 100) if running else (80, 170, 225)
    draw.rounded_rectangle((x1 - pill_w - 42, y1 - 74, x1 - 42, y1 - 28), radius=23, fill=fill)
    text(draw, (x1 - 42 - pill_w // 2, y1 - 51), status, mono(25), col, anchor="mm", stroke_width=1)


def list_screen(cli: str, many=False, w=1080, h=2400) -> Image.Image:
    img = Image.new("RGB", (w, h), (247, 249, 248))
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, w, 288), fill=(255, 255, 255))
    draw_status(draw, w)
    app_header(draw, w, "CosmoRemote", "Claude" if cli == "CLAUDE" else "Codex")
    if cli == "CLAUDE":
        rows = [
            ("Fix auth middleware", "Deploying to staging...", "~/Projects/cosmo-api", "MacBook Pro", "RUNNING", True),
            ("Add dark mode", "Done! I've added a theme picker to SettingsView with three options:", "~/Projects/cosmo-ios", "MacBook Pro", "IDLE", False),
            ("Database migration", "Created migration `20260406_add_tags_to_posts`:", "~/work/backend", "Mac Mini M4", "IDLE", False),
        ]
        if many:
            rows += [
                ("Review push delivery", "Updated Android settings to show delivery diagnostics.", "~/Projects/cosmoremote", "MacBook Pro", "IDLE", False),
                ("Polish screenshots", "Added Play Store Android frames and localized copy.", "~/Projects/store", "Mac mini M4", "IDLE", False),
                ("Release checklist", "The checklist now includes store metadata and QA.", "~/Projects/mobile", "MacBook Pro", "IDLE", False),
            ]
    else:
        rows = [
            ("Write API tests", "Created `tests/auth.test.ts` with 12 test cases:", "~/Projects/cosmo-api", "MacBook Pro", "IDLE", False),
            ("Redesign hero section", "Updated the hero section with:", "~/Projects/landing", "MacBook Pro", "RUNNING", True),
            ("Push notification backend", "Updated Android settings to show delivery diagnostics.", "~/Projects/cosmoremote/backend", "MacBook Pro", "IDLE", False),
            ("Import workspace config", "Done. The workspace now has configuration checks.", "~/Projects/CosmoHQ", "Mac mini M4", "IDLE", False),
        ]
    y = 330
    row_h = 190 if many else 210
    gap = 22
    for row in rows[:6]:
        session_row(draw, (34, y, w - 34, y + row_h), *row)
        y += row_h + gap
    nav_bar(draw, w, h, "claude" if cli == "CLAUDE" else "codex")
    return img


def modal_screen(w=1080, h=2400) -> Image.Image:
    img = list_screen("CODEX", w=w, h=h).convert("RGBA")
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 88))
    img.alpha_composite(overlay)
    draw = ImageDraw.Draw(img)
    x0, y0, x1, y1 = 118, 430, w - 118, 2050
    draw.rounded_rectangle((x0, y0, x1, y1), radius=70, fill=(251, 252, 255))
    text(draw, (x0 + 70, y0 + 82), "New Codex Session", font(61), (17, 24, 39))
    draw.rounded_rectangle((x0 + 70, y0 + 210, x0 + 360, y0 + 280), radius=19, fill=(235, 221, 255))
    text(draw, (x0 + 215, y0 + 245), "New session", font(30), (17, 24, 39), anchor="mm", stroke_width=1)
    draw.rounded_rectangle((x0 + 382, y0 + 210, x0 + 700, y0 + 280), radius=19, fill=(255, 255, 255), outline=(204, 215, 226), width=3)
    text(draw, (x0 + 542, y0 + 245), "Continue ended\none", font(29), (80, 91, 111), anchor="mm", stroke_width=1)
    draw.rounded_rectangle((x0 + 70, y0 + 356, x1 - 70, y0 + 486), radius=12, fill=(255, 255, 255), outline=(204, 215, 226), width=3)
    text(draw, (x0 + 112, y0 + 420), "Session name", font(39), (80, 91, 111), anchor="lm")
    text(draw, (x0 + 70, y0 + 575), "Mac", font(30), (80, 91, 111), stroke_width=1)
    for i, (name, path, selected) in enumerate([
        ("MacBook Pro", "~/Projects/cosmo-api", True),
        ("Mac Mini M4", "~/Projects/mobile", False),
    ]):
        cy = y0 + 685 + i * 150
        draw.ellipse((x0 + 102, cy - 23, x0 + 148, cy + 23), outline=(90, 139, 245) if selected else (80, 91, 111), width=6)
        if selected:
            draw.ellipse((x0 + 114, cy - 11, x0 + 136, cy + 11), fill=(90, 139, 245))
        text(draw, (x0 + 190, cy - 29), name, font(38), (80, 91, 111))
        text(draw, (x0 + 190, cy + 24), path, mono(26), (80, 91, 111), stroke_width=1)
    text(draw, (x0 + 70, y0 + 1030), "Working directory", font(30), (80, 91, 111), stroke_width=1)
    draw.rounded_rectangle((x0 + 70, y0 + 1090, x1 - 70, y0 + 1220), radius=12, fill=(255, 255, 255), outline=(204, 215, 226), width=3)
    text(draw, (x0 + 112, y0 + 1154), "~/Projects/cosmo-api", mono(34), (17, 24, 39), anchor="lm")
    text(draw, (x1 - 112, y0 + 1154), "Browse", font(34), (90, 139, 245), anchor="rm", stroke_width=1)
    text(draw, (x0 + 70, y0 + 1310), "Conversations under workspace", font(30), (80, 91, 111), stroke_width=1)
    for i, item in enumerate(["Fix auth middleware", "API refresh follow-up", "Deploy staging hotfix"]):
        yy = y0 + 1370 + i * 68
        text(draw, (x0 + 104, yy), "•", font(32), (90, 139, 245), anchor="lm")
        text(draw, (x0 + 142, yy), item, font(29), (80, 91, 111), anchor="lm")
    text(draw, (x1 - 250, y1 - 86), "Cancel", font(33), (90, 139, 245), anchor="mm", stroke_width=1)
    text(draw, (x1 - 110, y1 - 86), "Create", font(33), (150, 158, 170), anchor="mm", stroke_width=1)
    return img.convert("RGB")


def bubble(draw, box, fill, msg, fnt, color=(17, 24, 39)):
    draw.rounded_rectangle(box, radius=32, fill=fill)
    x, y = box[0] + 34, box[1] + 28
    for line in msg.split("\n"):
        text(draw, (x, y), line, fnt, color)
        y += int(fnt.size * 1.35)


def session_screen(cli="CLAUDE", code=False, stream=False, w=1080, h=2400) -> Image.Image:
    img = Image.new("RGB", (w, h), (247, 249, 248))
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, w, 250), fill=(255, 255, 255))
    draw_status(draw, w)
    text(draw, (72, 160), "‹", font(72), (17, 24, 39), anchor="lm")
    title_s = "Fix auth middleware" if cli == "CLAUDE" else "Write API tests"
    text(draw, (148, 150), title_s, font(36), (17, 24, 39), stroke_width=1)
    text(draw, (148, 198), "MacBook Pro · ~/Projects/cosmo-api", mono(24), (80, 91, 111))
    y = 295
    if code:
        bubble(draw, (46, y, w - 170, y + 230), (255, 255, 255), "Deploying to staging...\n\n✓ Tests passed (42/42)\n✓ Built successfully\n✓ Deployed to staging-api.cosmoremote.app", font(29))
        y += 270
        bubble(draw, (190, y, w - 46, y + 132), (228, 241, 255), "Perfect. Open a PR and include the middleware regression test.", font(28))
        y += 172
        bubble(draw, (46, y, w - 82, y + 245), (255, 255, 255), "PR is ready. I added the refresh-token middleware fix, a regression test, and staging deploy notes.", font(28))
        y += 286
        draw.rounded_rectangle((46, y, w - 46, y + 525), radius=26, fill=(17, 24, 39))
        text(draw, (78, y + 44), "auth.middleware.ts", mono(24), (174, 182, 196))
        code_lines = [
            ("export async function refresh(req) {", (232, 236, 243)),
            ("  const token = readRefreshToken(req)", (125, 211, 252)),
            ("  const user = await verify(token,", (232, 236, 243)),
            ("    REFRESH_SECRET)", (134, 239, 172)),
            ("  return issueTokenPair(user)", (232, 236, 243)),
            ("}", (232, 236, 243)),
        ]
        yy = y + 94
        for line, col in code_lines:
            text(draw, (82, yy), line, mono(25), col)
            yy += 52
        draw.rounded_rectangle((w - 202, y + 28, w - 82, y + 76), radius=24, fill=(35, 44, 61))
        text(draw, (w - 142, y + 52), "Copy", font(23), (232, 236, 243), anchor="mm")
    else:
        bubble(draw, (190, y, w - 46, y + 150), (228, 241, 255), "Can you fix the refresh-token middleware and add coverage?", font(28))
        y += 190
        msg = "Reading src/middleware/auth.ts...\n\nThe refresh path is verifying against ACCESS_SECRET. Patching it to REFRESH_SECRET and adding tests now"
        if stream:
            msg += " ▌"
        bubble(draw, (46, y, w - 82, y + 370), (255, 255, 255), msg, font(28))
        y += 410
        draw.rounded_rectangle((46, y, w - 46, y + 410), radius=26, fill=(17, 24, 39))
        text(draw, (78, y + 52), "tests/auth-refresh.test.ts", mono(24), (174, 182, 196))
        for i, line in enumerate(["describe('refresh middleware', () => {", "  it('accepts a valid refresh token')", "  it('rejects an access token')", "})"]):
            text(draw, (82, y + 108 + i * 52), line, mono(25), (232, 236, 243) if i != 2 else (134, 239, 172))
    draw.rounded_rectangle((34, h - 335, w - 34, h - 240), radius=46, fill=(255, 255, 255), outline=(224, 229, 232), width=2)
    text(draw, (78, h - 288), "Send a prompt", font(31), (143, 153, 166), anchor="lm")
    text(draw, (w - 92, h - 288), "➤", font(38), (90, 139, 245), anchor="mm")
    nav_bar(draw, w, h, "claude" if cli == "CLAUDE" else "codex")
    return img


def tablet_screen(slide: int, w: int, h: int) -> Image.Image:
    img = Image.new("RGB", (w, h), (247, 249, 248))
    draw = ImageDraw.Draw(img)
    draw_status(draw, w, scale=w / 1080)
    margin = int(w * 0.045)
    top = int(h * 0.09)
    text(draw, (margin, top), "CosmoRemote", font(int(w * 0.037)), (17, 24, 39), stroke_width=1)
    text(draw, (margin, top + int(w * 0.042)), "Android tablet", mono(int(w * 0.02)), (80, 91, 111))
    if slide in (1, 3):
        lx0, ly0 = margin, top + int(w * 0.10)
        lx1, ly1 = int(w * 0.42), h - int(w * 0.07)
        rx0, ry0 = lx1 + int(w * 0.025), ly0
        rx1, ry1 = w - margin, ly1
        draw.rounded_rectangle((lx0, ly0, lx1, ly1), radius=int(w * 0.025), fill=(255, 255, 255), outline=(224, 229, 232), width=2)
        draw.rounded_rectangle((rx0, ry0, rx1, ry1), radius=int(w * 0.025), fill=(255, 255, 255), outline=(224, 229, 232), width=2)
        left_rows = [
            ("Fix auth middleware", "RUNNING", "MacBook Pro"),
            ("Add dark mode", "READY", "MacBook Pro"),
            ("Database migration", "READY", "Mac mini M4"),
            ("Review push delivery", "READY", "MacBook Pro"),
        ]
        yy = ly0 + int(w * 0.055)
        for title_s, status, mac in left_rows:
            text(draw, (lx0 + int(w * 0.035), yy), title_s, font(int(w * 0.022)), (17, 24, 39), stroke_width=1)
            text(draw, (lx0 + int(w * 0.035), yy + int(w * 0.034)), mac, mono(int(w * 0.016)), (80, 91, 111))
            text(draw, (lx1 - int(w * 0.035), yy + int(w * 0.018)), status, mono(int(w * 0.015)), (37, 188, 100) if status == "RUNNING" else (80, 170, 225), anchor="rm")
            yy += int(w * 0.105)
        if slide == 1:
            text(draw, (rx0 + int(w * 0.04), ry0 + int(w * 0.06)), "Codex", font(int(w * 0.03)), (17, 24, 39), stroke_width=1)
            for i, title_s in enumerate(["Write API tests", "Redesign hero section", "Import workspace config"]):
                yy = ry0 + int(w * (0.14 + i * 0.10))
                text(draw, (rx0 + int(w * 0.04), yy), title_s, font(int(w * 0.023)), (17, 24, 39), stroke_width=1)
                text(draw, (rx0 + int(w * 0.04), yy + int(w * 0.034)), "~/Projects/cosmo-api", mono(int(w * 0.016)), (143, 153, 166))
        else:
            text(draw, (rx0 + int(w * 0.04), ry0 + int(w * 0.06)), "Fix auth middleware", font(int(w * 0.03)), (17, 24, 39), stroke_width=1)
            bubble(draw, (rx0 + int(w * 0.04), ry0 + int(w * 0.13), rx1 - int(w * 0.12), ry0 + int(w * 0.30)), (255, 255, 255), "Reading middleware...\n\nPatching REFRESH_SECRET and adding regression tests ▌", font(int(w * 0.019)))
            draw.rounded_rectangle((rx0 + int(w * 0.04), ry0 + int(w * 0.34), rx1 - int(w * 0.04), ry0 + int(w * 0.62)), radius=int(w * 0.018), fill=(17, 24, 39))
            for i, line in enumerate(["const decoded = jwt.verify(", "  token,", "  REFRESH_SECRET", ")"]):
                text(draw, (rx0 + int(w * 0.07), ry0 + int(w * (0.39 + i * 0.045))), line, mono(int(w * 0.018)), (232, 236, 243) if i != 2 else (134, 239, 172))
    elif slide == 2:
        small = modal_screen(1080, 1728).resize((int(w * 0.76), int(w * 1.216)), Image.Resampling.LANCZOS)
        img.paste(small, ((w - small.width) // 2, int(h * 0.18)))
    elif slide == 4:
        small = list_screen("CLAUDE", many=True, w=1080, h=1728).resize((int(w * 0.76), int(w * 1.216)), Image.Resampling.LANCZOS)
        img.paste(small, ((w - small.width) // 2, int(h * 0.16)))
    else:
        small = session_screen(code=True, w=1080, h=1728).resize((int(w * 0.76), int(w * 1.216)), Image.Resampling.LANCZOS)
        img.paste(small, ((w - small.width) // 2, int(h * 0.16)))
    return img


def device_frame(screen: Image.Image, target_w: int, phone=True, angle=0) -> Image.Image:
    ratio = screen.height / screen.width
    pad = max(10, int(target_w * (0.045 if phone else 0.032)))
    sw = target_w - pad * 2
    sh = int(sw * ratio)
    outer = Image.new("RGBA", (target_w, sh + pad * 2), (0, 0, 0, 0))
    draw = ImageDraw.Draw(outer)
    radius = int(target_w * (0.105 if phone else 0.055))
    draw.rounded_rectangle((0, 0, outer.width, outer.height), radius=radius, fill=(28, 29, 31))
    draw.rounded_rectangle((pad, pad, outer.width - pad, outer.height - pad), radius=radius - pad // 2, fill=(0, 0, 0))
    resized = screen.resize((sw, sh), Image.Resampling.LANCZOS).convert("RGBA")
    mask = rounded_mask((sw, sh), radius - pad)
    outer.paste(resized, (pad, pad), mask)
    if phone:
        draw.ellipse((target_w // 2 - 19, pad + 30, target_w // 2 + 19, pad + 68), fill=(9, 10, 12))
    else:
        draw.ellipse((target_w // 2 - 12, pad + 18, target_w // 2 + 12, pad + 42), fill=(9, 10, 12))
    if angle:
        outer = outer.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    return outer


def material_glyph(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float):
    col = (38, 38, 42)
    w, h = int(34 * scale), int(58 * scale)
    draw.rounded_rectangle((x, y, x + w, y + h), radius=int(8 * scale), outline=col, width=max(2, int(3 * scale)))
    draw.ellipse((x + w // 2 - int(3 * scale), y + h - int(10 * scale), x + w // 2 + int(3 * scale), y + h - int(4 * scale)), fill=col)
    text(draw, (x + int(88 * scale), y + int(29 * scale)), "→", font(int(39 * scale)), col, anchor="mm")


def draw_marketing_copy(draw, title_s, subtitle_s, canvas_w, kind):
    scale = canvas_w / 1080
    x = int(72 * scale)
    y = int(66 * scale)
    title_font = font(int((76 if kind == "phone" else 64) * scale))
    sub_font = font(int((43 if kind == "phone" else 36) * scale))
    line_h = int((98 if kind == "phone" else 82) * scale)
    for i, line in enumerate(title_s.split("\n")):
        text(draw, (x, y + i * line_h), line, title_font, (0, 0, 0), stroke_width=max(1, int(1.1 * scale)))
    sy = y + len(title_s.split("\n")) * line_h + int(68 * scale)
    for i, line in enumerate(subtitle_s.split("\n")):
        text(draw, (x, sy + i * int(56 * scale)), line, sub_font, (126, 126, 129))
    material_glyph(draw, x + int(4 * scale), sy + int((len(subtitle_s.split("\n")) * 58 + 82) * scale), scale)


def compose_phone(slide: int, title_s: str, subtitle_s: str) -> Image.Image:
    w, h = SIZES["android-phone"]
    img = Image.new("RGBA", (w, h), "white")
    draw = ImageDraw.Draw(img)
    draw_marketing_copy(draw, title_s, subtitle_s, w, "phone")
    if slide == 1:
        left = device_frame(list_screen("CLAUDE", many=True), 510, True, -4)
        right = device_frame(list_screen("CODEX"), 520, True, 4)
        paste_with_shadow(img, left, (55, h - left.height + 22), blur=22, alpha=70)
        paste_with_shadow(img, right, (470, h - right.height - 28), blur=22, alpha=70)
    elif slide == 2:
        dev = device_frame(modal_screen(), 690, True, -5)
        paste_with_shadow(img, dev, (250, h - dev.height - 10), blur=24, alpha=80)
    elif slide == 3:
        left = device_frame(session_screen("CLAUDE", stream=True), 510, True, -4)
        right = device_frame(session_screen("CODEX", stream=True), 520, True, 4)
        paste_with_shadow(img, left, (52, h - left.height + 12), blur=22, alpha=70)
        paste_with_shadow(img, right, (475, h - right.height - 40), blur=22, alpha=70)
    elif slide == 4:
        dev = device_frame(list_screen("CLAUDE", many=True), 690, True, -5)
        paste_with_shadow(img, dev, (254, h - dev.height - 4), blur=24, alpha=80)
    else:
        dev = device_frame(session_screen("CLAUDE", code=True), 690, True, -5)
        paste_with_shadow(img, dev, (254, h - dev.height - 4), blur=24, alpha=80)
    return img.convert("RGB")


def compose_tablet(slide: int, title_s: str, subtitle_s: str, size_key: str) -> Image.Image:
    w, h = SIZES[size_key]
    img = Image.new("RGBA", (w, h), "white")
    draw = ImageDraw.Draw(img)
    draw_marketing_copy(draw, title_s, subtitle_s, w, "tablet")
    screen = tablet_screen(slide, w, h)
    dev_w = int(w * 0.78)
    angle = -3 if slide in (2, 4, 5) else 0
    dev = device_frame(screen, dev_w, False, angle)
    x = (w - dev.width) // 2 + (int(w * 0.035) if angle else 0)
    y = h - dev.height + int(h * 0.05)
    paste_with_shadow(img, dev, (x, y), blur=int(w * 0.024), alpha=70)
    return img.convert("RGB")


def save_hashed(img: Image.Image, locale: str, prefix: str, slide: int, width: int, height: int) -> dict:
    locale_dir = PUBLIC / locale
    locale_dir.mkdir(parents=True, exist_ok=True)
    tmp = locale_dir / f".{prefix}-{slide}.tmp.png"
    img.save(tmp, optimize=True)
    digest = hashlib.sha256(tmp.read_bytes()).hexdigest()[:12]
    final = locale_dir / f"{prefix}-{slide}-{digest}.png"
    tmp.rename(final)
    out_dir = OUT / locale
    out_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(final, out_dir / final.name)
    return {
        "src": f"/screenshots/{locale}/{final.name}",
        "width": width,
        "height": height,
        "hash": digest,
        "alt": f"Play Store Android {'phone' if prefix == 'android-phone' else 'tablet'} image {slide}",
    }


def load_data_ts() -> dict:
    raw = DATA_TS.read_text()
    match = re.search(r"export const landingData = (\{.*\})(?:\s+as const)?;\s*$", raw, re.S)
    if not match:
        raise RuntimeError("Could not parse landing-data.ts")
    return json.loads(match.group(1))


def write_data_ts(data: dict):
    DATA_TS.write_text(
        "// This file is generated by CosmoHQ landing sync. Do not edit manually.\n\n"
        "export const landingData = "
        + json.dumps(data, ensure_ascii=False, indent=2)
        + " as const;\n"
    )


def write_manifest(path: Path, data: dict):
    manifest = json.loads(path.read_text()) if path.exists() else {}
    manifest.update(data)
    path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")


def main():
    for base in (PUBLIC, OUT):
        for locale in LOCALES:
            loc = base / locale
            if loc.exists():
                for old in loc.glob("android-phone-*.png"):
                    old.unlink()
                for old in loc.glob("android-tablet-*.png"):
                    old.unlink()

    data = load_data_ts()
    generated = {locale: {"android-phone": [], "android-tablet": []} for locale in LOCALES}
    for locale, slides in LOCALES.items():
        for index, (title_s, subtitle_s) in enumerate(slides, start=1):
            phone_img = compose_phone(index, title_s, subtitle_s)
            generated[locale]["android-phone"].append(save_hashed(phone_img, locale, "android-phone", index, *SIZES["android-phone"]))

            tablet7_img = compose_tablet(index, title_s, subtitle_s, "android-tablet-7")
            generated[locale]["android-tablet"].append(save_hashed(tablet7_img, locale, "android-tablet-7", index, *SIZES["android-tablet-7"]))

            tablet10_img = compose_tablet(index, title_s, subtitle_s, "android-tablet-10")
            generated[locale]["android-tablet"].append(save_hashed(tablet10_img, locale, "android-tablet-10", index, *SIZES["android-tablet-10"]))

    for locale, devices in generated.items():
        data["screenshots"][locale]["android-phone"] = devices["android-phone"]
        data["screenshots"][locale]["android-tablet"] = devices["android-tablet"]
    data["copy"]["platforms"]["androidPhone"] = True
    data["copy"]["platforms"]["androidTablet"] = True
    write_data_ts(data)
    write_manifest(PUBLIC / "manifest.json", data)
    write_manifest(OUT / "manifest.json", data)

    print("Generated Android screenshot assets:")
    for locale, devices in generated.items():
        print(locale, len(devices["android-phone"]), "phone", len(devices["android-tablet"]), "tablet")


if __name__ == "__main__":
    main()
