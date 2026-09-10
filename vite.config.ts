import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  // The default Cloudflare deploy serves from the domain root, so bundled asset
  // URLs are root-absolute ("/build/..."). itch.io serves the build from an
  // arbitrary, unpredictable path inside a sandboxed iframe, so the "itch" build
  // mode switches to relative URLs ("./build/...") instead. The game's own
  // runtime asset paths ("assets/images/...") are already relative and work in
  // both cases.
  base: mode === "itch" ? "./" : "/",
  plugins: [react()],
  build: {
    outDir: "dist",
    target: "es2022",
    // Keep bundler output out of the way of the game's own /assets/ tree
    // (images, fonts, sounds are served verbatim from public/assets/).
    assetsDir: "build",
  },
}));
