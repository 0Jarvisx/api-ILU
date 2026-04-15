#!/bin/sh
set -e

echo "→ Aplicando migraciones de Prisma..."
npx prisma migrate deploy

echo "→ Corriendo seeders..."
node dist/seed.js

echo "→ Iniciando servidor..."
exec node dist/server.js
