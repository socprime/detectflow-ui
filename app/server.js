import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4173;
const BUILD_DIR = process.env.BUILD_DIR
  ? path.resolve(process.env.BUILD_DIR)
  : path.join(__dirname, 'build');
const API_PROXY_TARGET = process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000';
const HSTS_ENABLED = process.env.HSTS_ENABLED?.toLowerCase() !== 'false';

const isSseRequest = (req) => {
  const accept = req.headers.accept;
  if (typeof accept === 'string' && accept.includes('text/event-stream')) {
    return true;
  }

  const pathname = (req.url ?? '').split('?')[0];
  return /(^|\/)stream(\/|$)/.test(pathname);
};

app.use(
  helmet({
    strictTransportSecurity: HSTS_ENABLED,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'ws:', 'wss:'],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(
  compression({
    filter: (req, res) => {
      if (isSseRequest(req)) {
        return false;
      }

      return compression.filter(req, res);
    },
  }),
);

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use(
  createProxyMiddleware({
    target: API_PROXY_TARGET,
    changeOrigin: true,
    secure: false,
    // Disable inactivity timeouts so long-lived SSE streams are not dropped.
    proxyTimeout: 0,
    timeout: 0,
    pathFilter: (pathname) => pathname.startsWith('/api'),
    on: {
      proxyRes: (proxyRes, req) => {
        if (!isSseRequest(req)) {
          return;
        }

        proxyRes.headers['x-accel-buffering'] = 'no';
        proxyRes.headers['cache-control'] = 'no-cache';
      },
      error: (err, req, res) => {
        console.error(`Proxy error: ${err.message} - ${req.url}`);
        if (typeof res?.status === 'function' && !res.headersSent) {
          res.status(500).json({
            error: 'Proxy error',
            message: err.message,
          });
        } else if (res?.writable) {
          res.destroy?.();
        }
      },
    },
  }),
);

app.use(
  express.static(BUILD_DIR, {
    maxAge: '1h',
    etag: true,
    index: false,
  }),
);

app.get('*', (req, res) => {
  res.sendFile(path.join(BUILD_DIR, 'index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API proxy target: ${API_PROXY_TARGET}`);
  console.log(`HSTS: ${HSTS_ENABLED ? 'enabled' : 'disabled'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
