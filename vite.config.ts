/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react(), checker({ typescript: true })],
  // @ts-ignore
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setupTests.ts",
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
  publicDir: "public",
  server: {
    host: true,
    port: 3000,
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
  },
});
