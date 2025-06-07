# syntax=docker/dockerfile:1.4

# Build stage
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app/frontend

# Copy package files
COPY package.json yarn.lock ../
COPY frontend/package.json ./

# Install dependencies with BuildKit cache mount
RUN --mount=type=cache,target=/root/.yarn \
    --mount=type=cache,target=/root/.cache \
    yarn install --frozen-lockfile

# Copy source code
COPY frontend ./

# Build the Next.js app with BuildKit cache mount
RUN --mount=type=cache,target=/app/frontend/.next/cache \
    yarn build

# Development stage
FROM node:20-slim AS development

WORKDIR /app/frontend

# Copy package files
COPY package.json yarn.lock ../
COPY frontend/package.json ./

# Install dependencies with Next.js
RUN yarn install --frozen-lockfile && \
    yarn add next@latest react@latest react-dom@latest

# Copy source code for development
COPY frontend/src ./src
COPY frontend/next.config.ts ./
COPY frontend/tsconfig.json ./
COPY frontend/postcss.config.mjs ./
COPY frontend/.eslintrc.js ./
COPY frontend/.prettierrc ./
COPY frontend/public ./public

# Expose port
EXPOSE 3001

# Start the app in development mode
CMD ["yarn", "dev", "-p", "3001"]

# Production stage
FROM node:20-slim AS production

WORKDIR /app/frontend

# Copy only the necessary files from builder
COPY --from=builder /app/frontend/node_modules ./node_modules
COPY --from=builder /app/frontend/package.json ./
COPY yarn.lock ./
COPY --from=builder /app/frontend/.next ./.next
COPY frontend/public ./public

# Expose port
EXPOSE 3001

# Start the app in production mode
CMD ["yarn", "start", "-p", "3001"]