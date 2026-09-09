import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Assets are referenced with root-relative URLs ("/assets/..."), so the app
  // expects to be served from the domain root (the default Cloudflare Pages /
  // Worker setup).
  base: "/",
  plugins: [react()],
  build: {
    outDir: "dist",
    target: "es2022",
    // Keep bundler output out of the way of the game's own /assets/ tree
    // (images, fonts, sounds are served verbatim from public/assets/).
    assetsDir: "build",
  },
});
