import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    // Matches Jest's `resetMocks: true` (vitest's `restoreMocks` would
    // reinstate real implementations and defeat `vi.mock`).
    mockReset: true,
    // The suite predates Jest 29's snapshot format change; keep the legacy
    // escaping so the existing inline snapshots stay valid.
    snapshotFormat: { escapeString: true, printBasicPrototype: true },
    include: ["src/**/*.test.{js,jsx,ts,tsx}"],
    setupFiles: ["./vitest.setup.js"],
    // The default reporter hides console output from *passing* test files, so
    // warnings printed by a green run are invisible. Be verbose in CI, where
    // nobody is watching a live terminal and the log is the only record.
    reporters: process.env.CI ? ["verbose"] : ["default"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**"],
      exclude: ["src/**/*.test.*", "src/utils/test/**"],
    },
  },
});
