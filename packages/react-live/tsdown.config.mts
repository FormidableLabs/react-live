import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  target: "es2022",
  clean: true,
  deps: { neverBundle: ["react", "react-dom"] },
  // Keep the filenames 4.1.x published (dist/index.js, index.mjs, index.d.ts)
  // so `main`/`module`/`types` resolve exactly as before for older bundlers
  // that ignore `exports`.
  outExtensions: ({ format }) =>
    format === "cjs"
      ? { js: ".js", dts: ".d.ts" }
      : { js: ".mjs", dts: ".d.mts" },
  // Validate the published surface on every build, so a bad `exports` map or a
  // types/runtime mismatch fails here rather than after release.
  publint: true,
  attw: true,
});
