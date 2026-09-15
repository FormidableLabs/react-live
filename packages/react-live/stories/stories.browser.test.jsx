import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Smoke test: every story must render without throwing.
 *
 * This is the same glob the dev harness uses, so adding a story to
 * `main.jsx`'s sidebar also adds it here -- one definition, two consumers.
 */
const modules = import.meta.glob("./*.stories.jsx", { eager: true });

const stories = Object.entries(modules).flatMap(([path, mod]) =>
  Object.entries(mod)
    .filter(
      ([name, value]) =>
        name !== "title" &&
        value &&
        typeof value === "object" &&
        typeof value.render === "function",
    )
    .map(([name, story]) => ({ id: `${mod.title ?? path}/${name}`, story })),
);

/**
 * A story marked `expectsError` throws on purpose. React reports a caught
 * render error three times over -- twice as an uncaught error, once as a
 * warning -- and none of that is a failure here. Suppression is scoped to
 * those stories so unexpected output from any other story stays visible.
 */
const swallowErrorEvent = (event) => event.preventDefault();
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
  it("discovers stories through the shared glob", () => {
    expect(stories.length).toBeGreaterThan(0);
  });

  it.each(stories.map((entry) => [entry.id, entry.story]))(
    "%s renders",
    async (_id, story) => {
      if (story.expectsError) {
        suppressExpectedErrors();
      }

      const Story = () => story.render(story.args ?? {});
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
