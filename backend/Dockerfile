# syntax=docker/dockerfile:1.4

# Build stage
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app/backend

# Copy package files
COPY package.json yarn.lock ../
COPY backend/package.json ./

# Install dependencies with BuildKit cache mount
RUN --mount=type=cache,target=/root/.yarn \
    --mount=type=cache,target=/root/.cache \
    apt-get update && \
    apt-get install -y --no-install-recommends make gcc g++ python3 && \
    yarn install --frozen-lockfile && \
    yarn add nodemon ts-node -D && \
    npm rebuild bcrypt --build-from-source && \
    apt-get remove -y make gcc g++ python3 && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    yarn cache clean

# Development stage
FROM node:20-slim AS development

WORKDIR /app/backend

# Install development dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends make gcc g++ python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json yarn.lock ../
COPY backend/package.json ./

# Install dependencies
RUN yarn install --frozen-lockfile && \
    yarn add nodemon ts-node -D && \
    npm rebuild bcrypt --build-from-source

# Copy source code
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Expose ports
EXPOSE 3000
EXPOSE 9229

# Start the app with proper ESM support
CMD ["yarn", "start:dev"]

# Production stage (optional, uncomment if needed)
# FROM node:20-slim AS production
# WORKDIR /app/backend
# COPY --from=builder /app/backend/node_modules ./node_modules
# COPY --from=builder /app/backend/package.json ./
# COPY backend/dist ./dist
# EXPOSE 3000
# CMD ["yarn", "start:prod"]