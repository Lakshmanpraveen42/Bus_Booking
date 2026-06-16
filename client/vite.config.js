import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      allowedHosts: [
        'unsightly-eaten-crestless.ngrok-free.dev',
        'flavor-cosmetics-basket-tom.trycloudflare.com',
        'answered-florist-talked-century.trycloudflare.com',
        'distances-howard-fan-hurricane.trycloudflare.com'
      ],
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
