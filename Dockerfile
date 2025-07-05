# 1. Base image untuk build step
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies terlebih dahulu
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install

# Copy semua kode
COPY . .

# Build Next.js untuk production
RUN pnpm run build

# 2. Base image untuk production (lebih ringan)
FROM node:22-alpine AS runner

WORKDIR /app

# Hanya copy file build dan dependency production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env ./.env

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Jalankan Next.js
CMD ["next", "start"]
