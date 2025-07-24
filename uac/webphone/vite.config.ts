import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig((configEnv) => {
  const isDevelopment = configEnv.mode === 'development';

  return {
    plugins: [react()],
    server: {
      https: {
        key: 'dev_certs/server.key',
        cert: 'dev_certs/server.crt',
      },
      proxy: {
        '/api': {
          target: 'http://192.168.1.147:8080',
          changeOrigin: false,
          secure: false,
          ws: true,
        },
      },
    },
    css: {
      modules: {
        generateScopedName: isDevelopment
          ? '[name]__[local]__[hash:base64:5]'
          : '[hash:base64:5]',
      },
    },
  };
});
