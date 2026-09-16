import { afterEach } from "vitest";

/**
 * Fail on React's act() warning instead of printing it.
 *
 * "An update to X inside a test was not wrapped in act(...)" means a test
 * asserted while a state update was still in flight -- the assertion ran
 * against a half-settled tree and may be passing for the wrong reason. That is
 * a broken test, not a cosmetic warning.
 *
 * It is easy to miss otherwise: vitest's default reporter hides console output
 * from *passing* test files, so these only appear under --reporter=verbose.
 */
const actWarnings = [];
const originalError = console.error;

console.error = (...args) => {
  if (String(args[0] ?? "").includes("not wrapped in act")) {
    actWarnings.push(String(args[0]).split("\n")[0]);
    return;
  }
  originalError(...args);
};

afterEach(() => {
  if (actWarnings.length === 0) return;
  const seen = actWarnings.splice(0);
  throw new Error(
    `React act() warning -- assert after state settles (e.g. await a findBy* query):\n  ${seen.join("\n  ")}`,
  );
});
