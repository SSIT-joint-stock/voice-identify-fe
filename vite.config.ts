import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api/v1/auth": {
        target: "http://localhost:5174",
        changeOrigin: true,
      },
      "/api/v1/user": {
        target: "http://localhost:5174",
        changeOrigin: true,
      },
      "/api/v1/identify/start": {
        target: "http://localhost:5174",
        changeOrigin: true,
      },
      "/api/v1": {
        target: "https://thermoduric-unnominated-cullen.ngrok-free.dev",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, ""),
      },
    },
  },
});
