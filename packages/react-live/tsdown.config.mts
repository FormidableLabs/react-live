import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  target: "es2022",
  clean: true,
  deps: { neverBundle: ["react", "react-dom"] },
  // Validate the published surface on every build, so a bad `exports` map or a
  // types/runtime mismatch fails here rather than after release.
  publint: true,
  attw: true,
});
