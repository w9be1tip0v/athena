#!/usr/bin/env bash
# Per-boot startup for the Athena Cloud Agent environment.
# Brings up the local Postgres cluster and waits until it accepts
# connections. Idempotent: a no-op if Postgres is already running.
set -euo pipefail

export PATH="/usr/lib/postgresql/16/bin:$HOME/.bun/bin:$PATH"
PGDATA="$HOME/pgdata"
PGSOCK="$HOME/pgsock"
mkdir -p "$PGSOCK"

if pg_ctl -D "$PGDATA" status >/dev/null 2>&1; then
  echo "[start] Postgres already running."
else
  echo "[start] Starting Postgres..."
  pg_ctl -D "$PGDATA" -l "$HOME/pg.log" -w start
fi

for _ in $(seq 1 30); do
  if psql -U postgres -h localhost -p 5432 -tc "SELECT 1" >/dev/null 2>&1; then
    echo "[start] Postgres is ready on localhost:5432."
    exit 0
  fi
  sleep 1
done

echo "[start] ERROR: Postgres did not become ready." >&2
exit 1
