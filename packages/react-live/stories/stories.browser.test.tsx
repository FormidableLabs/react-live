import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { loadStories } from "./load";

/**
 * Smoke test: every story must render without throwing.
 *
 * This is the same loader the dev harness uses, so adding a story to
 * `main.tsx`'s sidebar also adds it here -- one definition, two consumers.
 */
const stories = loadStories();

/**
 * A story marked `expectsError` throws on purpose. React reports a caught
 * render error three times over -- twice as an uncaught error, once as a
 * warning -- and none of that is a failure here. Suppression is scoped to
 * those stories so unexpected output from any other story stays visible.
 */
const swallowErrorEvent = (event: ErrorEvent) => event.preventDefault();
let suppressing = false;

const suppressExpectedErrors = () => {
  suppressing = true;
  vi.spyOn(console, "error").mockImplementation(() => {});
  window.addEventListener("error", swallowErrorEvent);
};

afterEach(() => {
  if (suppressing) {
    window.removeEventListener("error", swallowErrorEvent);
    vi.restoreAllMocks();
    suppressing = false;
  }
});

describe("stories", () => {
  it("discovers stories through the shared loader", () => {
    expect(stories.length).toBeGreaterThan(0);
  });

  it.each(stories.map((entry) => [entry.id, entry] as const))(
    "%s renders",
    async (_id, story) => {
      if (story.expectsError) {
        suppressExpectedErrors();
      }

      const Story = () => story.render();
      const { container } = render(<Story />);

      // LiveProvider transpiles in an effect, so a story is not really
      // "rendered" until that settles. Without this the assertion runs against
      // the first paint, and any error surfaces after the test has passed --
      // landing outside any test, which is why it appeared intermittently.
      await act(async () => {});

      expect(container.firstChild).not.toBeNull();
    },
  );
});
