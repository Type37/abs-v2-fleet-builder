import { defineConfig } from "vite";

export default defineConfig({
  root: "web",
  // Relative asset paths so the build works from any subpath (e.g. GitHub
  // Pages serves this from /<repo-name>/, not the domain root).
  base: "./",
  server: {
    port: 5731,
    strictPort: true,
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
