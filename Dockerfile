# Production Dockerfile for Sakthimurugan Medical Agency
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm --prefix backend install
RUN npm --prefix frontend install

# Copy source files
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Build React production bundle
RUN npm --prefix frontend run build

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/package.json ./package.json

EXPOSE 5000

CMD ["node", "backend/server.js"]
