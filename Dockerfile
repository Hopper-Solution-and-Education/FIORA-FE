# syntax=docker.io/docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY prisma ./prisma/
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./

# ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Load environment variables from .env.development.local
ENV $(cat .env.development.local | xargs)
EXPOSE 3000

CMD ["npm", "run", "start"]
