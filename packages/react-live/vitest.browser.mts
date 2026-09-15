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
