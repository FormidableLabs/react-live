import { render } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { describe, expect, it, vi } from "vitest";

import LiveProvider from "./LiveProvider";
import LiveEditor from "./LiveEditor";

/**
 * Editing behaviour, in a real browser.
 *
 * jsdom cannot cover any of this: it has no contentEditable editing model, so
 * synthesised key events never produce input. See the jsdom-side
 * `Editor/index.test.jsx` for rendering, highlighting, and theming.
 *
 * Caret position is asserted *behaviourally* -- type a character and see where
 * it lands. Reading `Selection` offsets directly is meaningless here, because
 * Prism splits every line into many token spans plus a trailing newline node.
 */
const setup = async (code) => {
  const onChange = vi.fn();
  const { container } = render(
    <LiveProvider code={code}>
      <LiveEditor onChange={onChange} />
    </LiveProvider>,
  );
  const pre = container.querySelector("pre");
  await userEvent.click(pre);
  return { pre, onChange, text: () => pre.textContent };
};

describe("editor interaction", () => {
  it("types characters into the editor", async () => {
    const { text } = await setup("ab");
    await userEvent.keyboard("XYZ");
    expect(text()).toContain("abXYZ");
  });

  it("leaves the caret at the click position", async () => {
    const { text } = await setup("abc");
    await userEvent.keyboard("Z");
    expect(text()).toContain("abcZ");
  });

  it("honours Home to jump to the start of the line", async () => {
    const { text } = await setup("abc");
    await userEvent.keyboard("{Home}Z");
    expect(text()).toContain("Zabc");
  });

  /**
   * Regression test for "Fix cursor position on return key press" (#392 era),
   * which shipped without one. If the caret does not move to the new line,
   * the typed character is appended to line 1 instead.
   */
  it("moves the caret to the new line after Enter", async () => {
    const { text } = await setup("abc");
    await userEvent.keyboard("{Enter}z");
    expect(text()).toContain("abc\nz");
    expect(text()).not.toContain("abcz");
  });

  it("keeps typing on the new line after Enter", async () => {
    const { text } = await setup("first");
    await userEvent.keyboard("{Enter}second");
    expect(text()).toContain("first\nsecond");
  });

  it("reports each edit through onChange", async () => {
    const { onChange } = await setup("a");
    await userEvent.keyboard("bc");
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)[0]).toContain("abc");
  });
});
