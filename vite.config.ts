import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  const plugins = [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ];

  if (env.VITE_ENVIRONMENT_STAGE !== 'prod') {
    plugins.push(
      checker({
        typescript: true,
      }),
    );
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '@/assets/scss/palette' as palette;`,
        },
      },
    },
    optimizeDeps: {
      exclude: ['@monaco-editor/react'],
    },
    build: {
      outDir: 'build',
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
    },
    worker: {
      format: 'es',
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      allowedHosts: (env.VITE_PREVIEW_ALLOWED_HOSTS || 'localhost,127.0.0.1')
        .split(',')
        .map((host) => host.trim()),
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:8000',
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
