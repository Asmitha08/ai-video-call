import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [react(), basicSsl()],

  server: {
    // Expose on all network interfaces so other devices on the same
    // WiFi/LAN can open https://<your-ip>:5173 and join calls.
    host: true,
    port: 5173,

    // Proxy Socket.IO traffic to the backend signaling server
    proxy: {
      '/socket.io': {
        target: 'http://localhost:4000',
        ws: true,
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
