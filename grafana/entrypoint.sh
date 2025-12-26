#!/usr/bin/env bash
set -e

# Parse DATABASE_URL into separate components for Grafana
if [ -n "$DATABASE_URL" ]; then
  CONN_STRING=$(echo "$DATABASE_URL" | sed 's|^[^:]*://||')

  export DATABASE_USER=$(echo "$CONN_STRING" | cut -d: -f1)
  export DATABASE_PASSWORD=$(echo "$CONN_STRING" | sed -n 's|[^:]*:\([^@]*\)@.*|\1|p')

  HOST_PORT=$(echo "$CONN_STRING" | sed -n 's|.*@\([^/]*\)/.*|\1|p')

  if echo "$HOST_PORT" | grep -q ':'; then
    export DATABASE_HOST=$(echo "$HOST_PORT" | cut -d: -f1)
    export DATABASE_PORT=$(echo "$HOST_PORT" | cut -d: -f2)
  else
    export DATABASE_HOST="$HOST_PORT"
    export DATABASE_PORT="5432"
  fi

  export DATABASE_NAME=$(echo "$CONN_STRING" | sed -n 's|.*/\([^?]*\).*|\1|p')
fi

exec /run.sh "$@"
