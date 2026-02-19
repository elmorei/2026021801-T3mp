#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_DIR="$ROOT_DIR/web"
DIST_DIR="$ROOT_DIR/dist"

required=(
  "$WEB_DIR/index.html"
  "$WEB_DIR/css/app.css"
  "$WEB_DIR/js/main.js"
  "$WEB_DIR/js/config.js"
  "$WEB_DIR/js/flags.js"
  "$WEB_DIR/js/noise.js"
)

for file in "${required[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
done

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"
cp -R "$WEB_DIR/." "$DIST_DIR/"

echo "Build complete: $DIST_DIR"
