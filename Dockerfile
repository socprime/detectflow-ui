# ---------------------------------------------------------------------------
# Stage 1: build the frontend.
# Everything here (sources, dev dependencies, the Vite toolchain) stays in this
# stage and is dropped from the final image, keeping the runtime image small.
# ---------------------------------------------------------------------------
FROM node:22.23.4-alpine AS builder

WORKDIR /src

# Install dependencies first so this layer is cached while sources change.
COPY package.json ./
RUN yarn install

# Build the app; Vite outputs to /src/app/build (outDir is "app/build").
COPY . .
RUN yarn build

# ---------------------------------------------------------------------------
# Stage 2: runtime — only the Express server and the built static assets.
# ---------------------------------------------------------------------------
FROM node:22.23.4-alpine

WORKDIR /app

ENV NODE_ENV=production

# Server has its own package.json; --frozen-lockfile guarantees reproducible
# installs from the committed app/yarn.lock.
COPY app/package.json app/yarn.lock ./
RUN yarn install --production --frozen-lockfile && \
    yarn cache clean

# Express server + the assets produced by the builder stage.
COPY app/server.js ./
COPY --from=builder /src/app/build ./build

# Run as a non-root user for security.
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 4173

# Periodically probe the server's /health endpoint.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4173/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]
