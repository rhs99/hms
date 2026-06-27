import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    // HMR is reached through the Caddy reverse proxy on https://localhost,
    // so tell the client to open the WS over wss on the proxy's port.
    hmr: {
      protocol: 'wss',
      host: 'localhost',
      clientPort: 443,
    },
    watch: {
      usePolling: true,
    },
    allowedHosts: ['localhost'],
  },
  build: {
    outDir: 'build',
  },
});
