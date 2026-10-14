#!/usr/bin/env bash
# Installs every registry item into a fresh shadcn Vite app and builds it.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
port="${PORT:-4399}"
url="http://localhost:$port"
workdir="$(mktemp -d)"

cd "$root"
REGISTRY_URL="$url" pnpm registry:build >/dev/null
node -e '
  const { createReadStream } = require("node:fs");
  require("node:http")
    .createServer((request, response) =>
      createReadStream(`public${request.url}`)
        .on("error", () => response.writeHead(404).end())
        .pipe(response),
    )
    .listen(process.argv[1]);
' "$port" &
server=$!
trap 'kill "$server"; cd "$root" && pnpm registry:build >/dev/null' EXIT

cd "$workdir"
pnpm dlx shadcn@latest init -t vite -b base -p vega -n app --no-monorepo -y >/dev/null
cd app
items=$(node -e '
  const { items } = require(process.argv[1]);
  console.log(items.map((item) => `${process.argv[2]}/r/${item.name}.json`).join(" "));
' "$root/registry.json" "$url")
# shellcheck disable=SC2086
pnpm dlx shadcn@latest add $items -y -o >/dev/null

if grep -rn "@/registry/" src; then
  echo "installed files still import from @/registry" >&2
  exit 1
fi
pnpm build
echo "installed and built in $workdir/app"
