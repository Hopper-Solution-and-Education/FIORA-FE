# syntax=docker.io/docker/dockerfile:1
FROM --platform=linux/amd64 node:20-bullseye-slim AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY prisma ./prisma/
COPY package.json ./
RUN npm ci 

FROM --platform=linux/amd64 node:20-bullseye-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM --platform=linux/amd64 node:20-alpine AS runner
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./

# ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Load environment variables from .env.development.local
ENV $(cat .env.development.local | xargs)

EXPOSE 3000

CMD ["npm", "run", "start"]
