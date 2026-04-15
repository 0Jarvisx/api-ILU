# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY tsconfig.seed.json ./

RUN npm ci

COPY src ./src

RUN npm run build
RUN npx prisma generate

# ─── Stage 2: Production ─────────────────────────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev

# Copiar el cliente Prisma ya generado con el binario correcto (linux-musl-arm64-openssl-3.0.x)
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma

COPY --from=builder /app/dist ./dist

# Entrypoint: migrations + seed + server
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

# Carpeta para uploads locales
RUN mkdir -p uploads

EXPOSE 3000

CMD ["sh", "entrypoint.sh"]
