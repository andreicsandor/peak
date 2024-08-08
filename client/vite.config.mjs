import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

const API_AUTH_URL = 'https://localhost:8079';
const API_WEATHER_URL = 'https://localhost:8083';

export default defineConfig({
  server: {
    host: 'localhost',
    port: 5173,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert/server-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/server-cert.pem')),
    },
    proxy: {
      '/login': {
        target: API_AUTH_URL,
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: API_AUTH_URL,
        changeOrigin: true,
        secure: false,
      },
      '/weather': {
        target: API_WEATHER_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
});
