import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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

describe("stories", () => {
  it("discovers stories through the shared glob", () => {
    expect(stories.length).toBeGreaterThan(0);
  });

  it.each(stories.map((entry) => [entry.id, entry.story]))(
    "%s renders",
    (_id, story) => {
      const Story = () => story.render(story.args ?? {});
      const { container } = render(<Story />);
      expect(container.firstChild).not.toBeNull();
    },
  );
});
