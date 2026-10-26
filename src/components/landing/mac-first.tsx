"use client";

import { useState } from "react";
import { Check, Copy, Monitor } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export type MacFirstContent = {
  title: string;
  body: string;
  commands: string[];
  copy: string;
  copied: string;
  emailLabel: string;
  emailPlaceholder: string;
  send: string;
  sent: string;
  error: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.cosmoremote.com";

export function MacFirst({ locale, content }: { locale: Locale; content: MacFirstContent }) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(content.commands.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: the commands stay selectable */
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch(`${API_BASE}/public/setup-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang: locale }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mt-7 rounded-2xl border border-white/16 bg-white/8 p-4 sm:p-5" data-testid="mac-first">
      <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#8fd1ff]">
        <Monitor className="size-4" />
        {content.title}
      </p>
      <p className="mt-2 text-sm leading-6 text-white/80">{content.body}</p>
      <div className="mt-3 flex items-start gap-3 rounded-xl border border-white/14 bg-black/30 p-3">
        <pre className="min-w-0 flex-1 overflow-x-auto font-mono text-[13px] leading-6 text-white">
          {content.commands.map((cmd) => `$ ${cmd}`).join("\n")}
        </pre>
        <button
          type="button"
          onClick={copyAll}
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-white/20 px-3 text-xs font-semibold text-white hover:bg-white/10"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? content.copied : content.copy}
        </button>
      </div>
      <form onSubmit={submit} className="mt-4">
        <label htmlFor="mac-first-email" className="text-sm text-white/78">
          {content.emailLabel}
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="mac-first-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={content.emailPlaceholder}
            className="h-11 min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/45"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="h-11 rounded-lg bg-[#3498db] px-5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {content.send}
          </button>
        </div>
        <p role="status" className="mt-2 min-h-5 text-sm text-white/80">
          {status === "sent" ? content.sent : status === "error" ? content.error : ""}
        </p>
      </form>
    </div>
  );
}
