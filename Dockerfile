# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine

WORKDIR /app

# Cài libc6-compat để hỗ trợ một số package trên Alpine
RUN apk add --no-cache libc6-compat

# Copy và cài đặt dependencies
COPY prisma ./prisma/
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy toàn bộ code và build
COPY . .
RUN npm run build

# Cấu hình môi trường
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "run", "start"]