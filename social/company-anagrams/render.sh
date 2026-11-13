#!/bin/bash
# Renders social.html to static/images/social_sketch_11_viz.webp.
# Usage: ./social/company-anagrams/render.sh   (from anywhere)
# To preview while editing, just open social.html in a browser.

set -e
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
HERE="$ROOT/social/company-anagrams"
TMP="$(mktemp -d)"; PNG="$TMP/social.png"
trap 'rm -rf "$TMP"' EXIT
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --allow-file-access-from-files --window-size=1500,802 --virtual-time-budget=3000 \
    --screenshot="$PNG" "file://$HERE/social.html" 2>/dev/null

ffmpeg -loglevel error -y -i "$PNG" -quality 92 "$ROOT/static/images/social_sketch_11_viz.webp"
echo "→ static/images/social_sketch_11_viz.webp"
