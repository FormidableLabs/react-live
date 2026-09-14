import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    mockReset: true,
    // The suite predates Jest 29's snapshot format change; keep the legacy
    // escaping so the existing inline snapshots stay valid.
    snapshotFormat: { escapeString: true, printBasicPrototype: true },
    include: ["src/**/*.test.{js,jsx,ts,tsx}"],
  },
});
