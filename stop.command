#!/usr/bin/env bash
#
# stop.command — Stop the WLLPR development or production server.
#
# Usage:
#   ./stop.command              Stop both servers
#   ./stop.command dev          Stop the Vite dev server only
#   ./stop.command prod         Stop the Deno production server only
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
PID_DIR="$ROOT/.pids"

DEV_PID_FILE="$PID_DIR/vite.pid"
PROD_PID_FILE="$PID_DIR/deno.pid"

# ── Colors ───────────────────────────────────────────────────────────────────

BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'
CYAN='\033[36m'
GREEN='\033[32m'
RED='\033[31m'
YELLOW='\033[33m'
WHITE='\033[97m'

# ── Banner ───────────────────────────────────────────────────────────────────

print_banner() {
  echo ""
  echo -e "${RED}╔══════════════════════════════════════════════════════════════════╗${RESET}"
  echo -e "${RED}║${RESET}                                                                ${RED}║${RESET}"
  echo -e "${RED}║${RESET}   ${BOLD}${WHITE}██╗    ██╗███████╗██╗      ██████╗ ██╗    ██╗${RESET}               ${RED}║${RESET}"
  echo -e "${RED}║${RESET}   ${BOLD}${WHITE}██║    ██║██╔════╝██║     ██╔═══██╗██║    ██║${RESET}               ${RED}║${RESET}"
  echo -e "${RED}║${RESET}   ${BOLD}${WHITE}██║ █╗ ██║█████╗  ██║     ██║   ██║██║ █╗ ██║${RESET}               ${RED}║${RESET}"
  echo -e "${RED}║${RESET}   ${BOLD}${WHITE}██║███╗██║██╔══╝  ██║     ██║   ██║██║███╗██║${RESET}               ${RED}║${RESET}"
  echo -e "${RED}║${RESET}   ${BOLD}${WHITE}╚███╔███╔╝███████╗███████╗╚██████╔╝╚███╔███╔╝${RESET}               ${RED}║${RESET}"
  echo -e "${RED}║${RESET}   ${BOLD}${WHITE} ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝  ╚══╝╚══╝${RESET}               ${RED}║${RESET}"
  echo -e "${RED}║${RESET}                                                                ${RED}║${RESET}"
  echo -e "${RED}║${RESET}   ${DIM}Stopping Servers · Wallpaper Generator${RESET}                      ${RED}║${RESET}"
  echo -e "${RED}║${RESET}                                                                ${RED}║${RESET}"
  echo -e "${RED}╚══════════════════════════════════════════════════════════════════╝${RESET}"
  echo ""
}

# ── Helpers ──────────────────────────────────────────────────────────────────

stop_process() {
  local name="$1"
  local pid_file="$2"

  if [[ ! -f "$pid_file" ]]; then
    echo -e "  ${DIM}⚪ $name: not running (no PID file)${RESET}"
    return 0
  fi

  local pid
  pid=$(cat "$pid_file")

  if kill -0 "$pid" 2>/dev/null; then
    echo -e "  ${YELLOW}⏹${RESET}  ${BOLD}Stopping $name${RESET} ${DIM}(PID $pid)...${RESET}"
    kill "$pid" 2>/dev/null || true
    # Wait up to 5 seconds for graceful shutdown
    for i in $(seq 1 10); do
      if ! kill -0 "$pid" 2>/dev/null; then
        break
      fi
      sleep 0.5
    done
    # Force kill if still running
    if kill -0 "$pid" 2>/dev/null; then
      echo -e "  ${RED}⚠️${RESET}  ${BOLD}$name: force killing PID $pid...${RESET}"
      kill -9 "$pid" 2>/dev/null || true
    fi
    echo -e "  ${GREEN}✓${RESET}  ${BOLD}$name stopped${RESET}"
  else
    echo -e "  ${DIM}⚪ $name: PID $pid is not running (stale PID file)${RESET}"
  fi

  rm -f "$pid_file"
}

# ── Main ─────────────────────────────────────────────────────────────────────

print_banner

case "${1:-all}" in
  dev)
    echo -e "  ${DIM}Mode:${RESET} ${BOLD}Development${RESET}"
    echo ""
    stop_process "Vite dev server" "$DEV_PID_FILE"
    ;;
  prod)
    echo -e "  ${DIM}Mode:${RESET} ${BOLD}Production${RESET}"
    echo ""
    stop_process "Deno server" "$PROD_PID_FILE"
    ;;
  all)
    echo -e "  ${DIM}Mode:${RESET} ${BOLD}All Servers${RESET}"
    echo ""
    stop_process "Vite dev server" "$DEV_PID_FILE"
    stop_process "Deno server" "$PROD_PID_FILE"
    ;;
  *)
    echo "Usage: $0 [dev|prod|all]"
    exit 1
    ;;
esac

# Clean up PID directory if empty
if [[ -d "$PID_DIR" ]] && [[ -z "$(ls -A "$PID_DIR" 2>/dev/null)" ]]; then
  rmdir "$PID_DIR"
fi

echo ""
echo -e "${DIM}────────────────────────────────────────────────────────────────${RESET}"
echo -e "  ${DIM}Tip:${RESET} Run ${BOLD}./start.command${RESET} to start servers"
echo -e "${DIM}────────────────────────────────────────────────────────────────${RESET}"
echo ""
