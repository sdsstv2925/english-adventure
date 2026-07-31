#!/bin/bash
cd "$(dirname "$0")/worker" || exit 1

echo "=== English School VERSION 38: deployment to Cloudflare Worker ==="
echo "If Cloudflare asks you to sign in, complete authorization in the browser."
echo

npx --yes wrangler@latest deploy
STATUS=$?

echo
if [ $STATUS -eq 0 ]; then
  echo "DEPLOYMENT COMPLETED SUCCESSFULLY"
  echo "Open the address shown above after 'Deployed english-scholl'."
else
  echo "DEPLOYMENT FAILED. Take a screenshot of the error in this window."
fi

echo
read -n 1 -s -r -p "Press any key to close..."
exit $STATUS
