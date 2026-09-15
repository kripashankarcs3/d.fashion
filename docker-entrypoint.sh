#!/bin/sh
set -e

# ── Stylist AI: local OpenCode server (the "server" mode the app uses) ──
# The container runs `opencode serve` on loopback exactly like the developer
# machine does; OPENCODE_AUTH_B64 is the base64 of the machine's auth.json.
DATA_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/opencode"
SANDBOX_DIR="${OPENCODE_SERVER_DIRECTORY:-/tmp/deestyle-stylist}"

mkdir -p "$DATA_DIR" "$SANDBOX_DIR"

if [ -n "$OPENCODE_AUTH_B64" ]; then
  echo "$OPENCODE_AUTH_B64" | base64 -d > "$DATA_DIR/auth.json" 2>/dev/null || \
    echo "OPENCODE_AUTH_B64 did not decode as base64" >&2
fi

echo "[entrypoint] starting opencode serve on 127.0.0.1:4096" >&2
opencode serve --hostname 127.0.0.1 --port 4096 >&2 &
SERVE_PID=$!
trap 'kill "$SERVE_PID" 2>/dev/null || true' EXIT INT TERM

_ready() {
  node -e "
    const creds = Buffer.from(
      (process.env.OPENCODE_SERVER_USERNAME||'opencode') + ':' +
      (process.env.OPENCODE_SERVER_PASSWORD||'')
    ).toString('base64');
    fetch('http://127.0.0.1:4096/experimental/tool/ids', {
      headers: { Authorization: 'Basic ' + creds },
      signal: AbortSignal.timeout(5000)
    }).then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1));
  " >/dev/null 2>&1
}

i=0
until _ready; do
  i=$((i + 1))
  if [ "$i" -ge 60 ]; then
    echo "[entrypoint] opencode serve never became ready" >&2
    exit 1
  fi
  sleep 1
done
echo "[entrypoint] opencode serve ready" >&2

exec node server/dist/server.js