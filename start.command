#!/usr/bin/env bash
#
# start.command — Start the WLLPR development or production server.
#
# Usage:
#   ./start.command              Start both servers
#   ./start.command dev          Start the Vite dev server only
#   ./start.command prod         Start the Deno production server only
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
PID_DIR="$ROOT/.pids"
mkdir -p "$PID_DIR"

DEV_PID_FILE="$PID_DIR/vite.pid"
PROD_PID_FILE="$PID_DIR/deno.pid"
DEV_LOG="$ROOT/.pids/vite.log"
PROD_LOG="$ROOT/.pids/deno.log"

DEV_PORT=3000
PROD_PORT=8000

# ── Colors ───────────────────────────────────────────────────────────────────

BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'
CYAN='\033[36m'
GREEN='\033[32m'
YELLOW='\033[33m'
MAGENTA='\033[35m'
WHITE='\033[97m'

# ── Banner ───────────────────────────────────────────────────────────────────

print_banner() {
  echo ""
  
  echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════╗${RESET}"
  echo -e "${CYAN}║${RESET}                                                                ${CYAN}║${RESET}"
  echo -e "${CYAN}║${RESET}   ${BOLD}${WHITE}██╗    ██╗███████╗██╗      ██████╗ ██╗    ██╗${RESET}               ${CYAN}║${RESET}"
  echo -e "${CYAN}║${RESET}   ${BOLD}${WHITE}██║    ██║██╔════╝██║     ██╔═══██╗██║    ██║${RESET}               ${CYAN}║${RESET}"
  echo -e "${CYAN}║${RESET}   ${BOLD}${WHITE}██║ █╗ ██║█████╗  ██║     ██║   ██║██║ █╗ ██║${RESET}               ${CYAN}║${RESET}"
  echo -e "${CYAN}║${RESET}   ${BOLD}${WHITE}██║███╗██║██╔══╝  ██║     ██║   ██║██║███╗██║${RESET}               ${CYAN}║${RESET}"
  echo -e "${CYAN}║${RESET}   ${BOLD}${WHITE}╚███╔███╔╝███████╗███████╗╚██████╔╝╚███╔███╔╝${RESET}               ${CYAN}║${RESET}"
  echo -e "${CYAN}║${RESET}   ${BOLD}${WHITE} ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝  ╚══╝╚══╝${RESET}               ${CYAN}║${RESET}"
  echo -e "${CYAN}║${RESET}                                                                ${CYAN}║${RESET}"
  echo -e "${CYAN}║${RESET}   ${DIM}Wallpaper Generator · Client-Side · Zero Backend${RESET}            ${CYAN}║${RESET}"
  echo -e "${CYAN}║${RESET}                                                                ${CYAN}║${RESET}"
  echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════╝${RESET}"
  echo ""
}

# ── Helpers ──────────────────────────────────────────────────────────────────

is_running() {
  local pid_file="$1"
  if [[ -f "$pid_file" ]]; then
    local pid
    pid=$(cat "$pid_file")
    if kill -0 "$pid" 2>/dev/null; then
      return 0
    fi
  fi
  return 1
}

start_dev() {
  if is_running "$DEV_PID_FILE"; then
    echo -e "  ${YELLOW}⚡ Vite dev server already running${RESET} ${DIM}(PID $(cat "$DEV_PID_FILE"))${RESET}"
    return 0
  fi

  echo -e "  ${GREEN}▶${RESET}  ${BOLD}Starting Vite dev server...${RESET}"
  cd "$ROOT"
  nohup npx vite --host > "$DEV_LOG" 2>&1 &
  echo $! > "$DEV_PID_FILE"
  sleep 1
  echo -e "  ${GREEN}✓${RESET}  ${BOLD}Dev server running${RESET}  ${DIM}(PID $(cat "$DEV_PID_FILE"))${RESET}"
  echo -e "     ${CYAN}➜${RESET}  ${BOLD}Local:${RESET}   http://localhost:${DEV_PORT}"
  LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost")
  echo -e "     ${CYAN}➜${RESET}  ${BOLD}Network:${RESET} http://${LOCAL_IP}:${DEV_PORT}"
}

start_prod() {
  if is_running "$PROD_PID_FILE"; then
    echo -e "  ${YELLOW}⚡ Deno server already running${RESET} ${DIM}(PID $(cat "$PROD_PID_FILE"))${RESET}"
    return 0
  fi

  # Build first if dist/ doesn't exist
  if [[ ! -d "$ROOT/dist" ]]; then
    echo -e "  ${MAGENTA}📦${RESET}  ${BOLD}Building project first...${RESET}"
    cd "$ROOT"
    npx tsc -b && npx vite build
  fi

  echo -e "  ${GREEN}▶${RESET}  ${BOLD}Starting Deno production server...${RESET}"
  cd "$ROOT"
  nohup deno run -A main.ts > "$PROD_LOG" 2>&1 &
  echo $! > "$PROD_PID_FILE"
  sleep 1
  echo -e "  ${GREEN}✓${RESET}  ${BOLD}Production server running${RESET}  ${DIM}(PID $(cat "$PROD_PID_FILE"))${RESET}"
  echo -e "     ${CYAN}➜${RESET}  ${BOLD}Local:${RESET}   http://localhost:${PROD_PORT}"
  LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost")
  echo -e "     ${CYAN}➜${RESET}  ${BOLD}Network:${RESET} http://${LOCAL_IP}:${PROD_PORT}"
}

# ── Main ─────────────────────────────────────────────────────────────────────

print_banner

case "${1:-all}" in
  dev)
    echo -e "  ${DIM}Mode:${RESET} ${BOLD}Development${RESET}"
    echo ""
    start_dev
    ;;
  prod)
    echo -e "  ${DIM}Mode:${RESET} ${BOLD}Production${RESET}"
    echo ""
    start_prod
    ;;
  all)
    echo -e "  ${DIM}Mode:${RESET} ${BOLD}All Servers${RESET}"
    echo ""
    start_dev
    echo ""
    start_prod
    ;;
  *)
    echo "Usage: $0 [dev|prod|all]"
    exit 1
    ;;
esac

echo ""
echo -e "${DIM}────────────────────────────────────────────────────────────────${RESET}"
echo -e "  ${DIM}Tip:${RESET} Run ${BOLD}./stop.command${RESET} to stop servers"
echo -e "${DIM}────────────────────────────────────────────────────────────────${RESET}"
echo ""
