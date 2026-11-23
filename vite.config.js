import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        tarjeta: resolve(import.meta.dirname, "tarjeta/index.html"),
      },
    },
  },
});
