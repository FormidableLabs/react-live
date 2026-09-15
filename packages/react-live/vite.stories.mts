import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Dev server for the story harness. `react-live` resolves to source, so edits
// to the library hot-reload without a build step.
export default defineConfig({
  root: "stories",
  plugins: [react()],
  resolve: {
    alias: {
      "react-live": fileURLToPath(new URL("./src/index.ts", import.meta.url)),
    },
  },
});
