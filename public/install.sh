#!/bin/sh
# CosmoRemote installer for macOS.
#   curl -fsSL https://cosmoremote.com/install.sh | sh
#   curl -fsSL https://cosmoremote.com/install.sh | sh -s -- --pair <GRANT>
#
# Picks the first thing that works: Homebrew, then an existing Node >= 18 with
# npm, then the official Node.js tarball from nodejs.org unpacked into
# ~/.cosmoremote/node (no sudo). Idempotent. Never runs sudo.
set -eu

DRY_RUN=0
PAIR_GRANT=""
NODE_MAJOR=20

while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run) DRY_RUN=1 ;;
    --pair)
      shift
      [ $# -gt 0 ] || { echo "error: --pair needs a grant" >&2; exit 2; }
      PAIR_GRANT="$1"
      ;;
    -h | --help)
      echo "Usage: install.sh [--pair <GRANT>] [--dry-run]"
      exit 0
      ;;
    *) echo "error: unknown option $1" >&2; exit 2 ;;
  esac
  shift
done

say() { printf '  %s\n' "$*"; }
run() {
  if [ "$DRY_RUN" -eq 1 ]; then
    say "[dry-run] $*"
  else
    "$@"
  fi
}

if [ "$(uname -s)" != "Darwin" ]; then
  echo "CosmoRemote's bridge installer supports macOS only." >&2
  exit 1
fi

have() { command -v "$1" >/dev/null 2>&1; }

node_ok() {
  have node || return 1
  major=$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)
  [ "$major" -ge 18 ] 2>/dev/null
}

npm_prefix_writable() {
  prefix=$(npm config get prefix 2>/dev/null || echo "")
  [ -n "$prefix" ] && [ -w "$prefix" ] && [ -w "$prefix/lib" ] 2>/dev/null
}

install_node_tarball() {
  case "$(uname -m)" in
    arm64) arch=arm64 ;;
    x86_64) arch=x64 ;;
    *) echo "Unsupported CPU: $(uname -m)" >&2; exit 1 ;;
  esac
  base="https://nodejs.org/dist/latest-v${NODE_MAJOR}.x"
  dest="$HOME/.cosmoremote/node"
  say "Node >= 18 not found. Installing the official Node.js ${NODE_MAJOR}.x build for darwin-${arch} into $dest"
  if [ "$DRY_RUN" -eq 1 ]; then
    say "[dry-run] curl -fsSL $base/SHASUMS256.txt, pick node-v*-darwin-${arch}.tar.gz"
    say "[dry-run] verify sha256, tar -xzf into $dest"
    PATH="$dest/bin:$PATH"
    return 0
  fi
  tmp=$(mktemp -d)
  trap 'rm -rf "$tmp"' EXIT
  curl -fsSL "$base/SHASUMS256.txt" -o "$tmp/SHASUMS256.txt"
  line=$(grep "node-v.*-darwin-${arch}\.tar\.gz\$" "$tmp/SHASUMS256.txt" | head -n 1)
  [ -n "$line" ] || { echo "Could not find a Node build for darwin-${arch}" >&2; exit 1; }
  file=$(printf '%s' "$line" | awk '{print $2}')
  curl -fsSL "$base/$file" -o "$tmp/$file"
  (cd "$tmp" && printf '%s\n' "$line" | shasum -a 256 -c -) >/dev/null \
    || { echo "Checksum mismatch for $file; aborting." >&2; exit 1; }
  mkdir -p "$dest"
  tar -xzf "$tmp/$file" -C "$dest" --strip-components 1
  PATH="$dest/bin:$PATH"
  say "Add this to your shell profile so 'cosmoremote' stays on PATH:"
  say "  export PATH=\"$dest/bin:\$PATH\""
}

echo
echo "  CosmoRemote installer"
echo

if have brew; then
  if brew list --formula cosmoremote >/dev/null 2>&1; then
    say "Homebrew: upgrading cosmoremote"
    run brew upgrade matheusjkweber/tap/cosmoremote || true
  else
    say "Homebrew: installing cosmoremote"
    run brew install matheusjkweber/tap/cosmoremote
  fi
else
  if ! node_ok; then
    install_node_tarball
  fi
  say "npm: installing cosmoremote globally"
  if [ "$DRY_RUN" -eq 0 ] && ! npm_prefix_writable; then
    echo "  npm's global folder is not writable by your user, and this script does not run sudo." >&2
    echo "  Run it yourself:  sudo npm install -g cosmoremote" >&2
    exit 1
  fi
  run npm install -g cosmoremote
fi

echo
if [ -n "$PAIR_GRANT" ]; then
  say "Done. Open Terminal in your project folder and run:"
  say "  cosmoremote start --pair $PAIR_GRANT"
else
  say "Done. Open Terminal in your project folder and run:"
  say "  cosmoremote start"
fi
echo
