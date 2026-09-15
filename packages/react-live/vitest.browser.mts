import { fileURLToPath } from "node:url";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

/**
 * Real-browser tests, kept separate from the jsdom suite.
 *
 * jsdom has no contentEditable editing model, so anything involving typing or
 * caret position has to run here. Requires `npx playwright install chromium`.
 */
export default defineConfig({
  resolve: {
    alias: {
      "react-live": fileURLToPath(new URL("./src/index.ts", import.meta.url)),
    },
  },
  test: {
    // Shared setup for consistency, though note React only emits act warnings
    // when IS_REACT_ACT_ENVIRONMENT is set, which it is not in a real browser --
    // so the act guard is inert here. Premature assertions in browser tests are
    // not caught automatically; await your interactions.
    // The CI reporter matters though: the default one hides output from passing
    // files.
    setupFiles: ["./vitest.setup.js"],
    restoreMocks: true,
    reporters: process.env.CI ? ["verbose"] : ["default"],
    include: [
      "src/**/*.browser.test.{js,jsx,ts,tsx}",
      "stories/**/*.browser.test.{js,jsx,ts,tsx}",
    ],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
