#!/usr/bin/env bash
# Start the WLLPR dev server.
# Usage:
#   ./start.sh        # default port (5173)
#   PORT=3000 ./start.sh
#
# Requires: Bun (https://bun.sh) — install with `npm i -g bun` if missing.

set -euo pipefail

cd "$(dirname "$0")"

if ! command -v bun >/dev/null 2>&1; then
  echo "❌ Bun is not installed or not on PATH." >&2
  echo "   Install with: curl -fsSL https://bun.sh/install | bash" >&2
  exit 1
fi

PORT="${PORT:-5173}"
HOST="${HOST:-localhost}"

echo "🌅 Starting WLLPR dev server on http://${HOST}:${PORT}"
echo "   (Ctrl-C to stop)"
echo ""

# Trap Ctrl-C / script-exit so cleanup runs whether the user stops it or it exits cleanly.
cleanup() {
  echo ""
  echo "👋 WLLPR dev server stopped."
}
trap cleanup EXIT INT TERM

exec bun run dev -- --host "${HOST}" --port "${PORT}"
