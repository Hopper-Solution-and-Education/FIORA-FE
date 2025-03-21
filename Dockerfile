# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine

WORKDIR /app

# Cài libc6-compat để hỗ trợ một số package trên Alpine
RUN apk add --no-cache libc6-compat

# Copy và cài đặt dependencies
COPY prisma ./prisma/
COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Load environment variables from .env.development.local
ENV $(cat .env.development.local | xargs)

EXPOSE 3000

CMD ["npm", "run", "start"]
