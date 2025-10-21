import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: true,
    https: {
      key: fs.readFileSync("./frontend.key"),
      cert: fs.readFileSync("./frontend.crt")
    },
    proxy: {
      // Proxy todas las peticiones que empiecen con /api hacia el backend
      '/api': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false, // Importante para certificados autofirmados
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
  build: {
    sourcemap: mode === "development",
  },
  base: "./",
}));
