import { setTimeout } from "node:timers/promises";
import { createRoot } from "react-dom/client";
import { act, render } from "@testing-library/react";
import { Prism, themes } from "prism-react-renderer";

import Editor from "./index";

/**
 * jsdom has no contentEditable editing model, so typing cannot be simulated
 * here -- these cover rendering, highlighting, and configuration. Interaction
 * (typing, caret placement after Enter, tabMode) needs a real browser; see
 * CONTRIBUTING.
 */

const settle = () => act(() => setTimeout(0));

const textNodes = (element) => {
  const nodes = [];
  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) nodes.push(node);
    node.childNodes.forEach(walk);
  };
  walk(element);
  return nodes;
};

// The editor renders a trailing newline text node after the code, so the caret
// goes at the end of the last text node that actually holds source.
const codeTextNode = (element) =>
  textNodes(element)
    .filter((node) => node.textContent.trim() !== "")
    .pop();

const renderEditor = async (props) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(() => {
    root.render(<Editor language="javascript" {...props} />);
  });

  const pre = container.querySelector("pre");
  // jsdom does not treat the contenteditable property that use-editable sets as
  // focusable, so give the element a tabIndex in order to focus it.
  pre.setAttribute("tabindex", "0");

  await act(() => {
    pre.focus();
    const node = codeTextNode(pre);
    const range = document.createRange();
    range.setStart(node, node.textContent.length);
    range.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    // use-editable records the caret from the browser's selectstart event.
    pre.dispatchEvent(new Event("selectstart", { bubbles: true }));
  });

  return { container, root, pre };
};

// use-editable reacts to the DOM mutation the browser makes while typing and
// flushes it on keyup, so replicating that sequence exercises the same path.
const typeCharacter = async (element, character) => {
  await act(() => {
    codeTextNode(element).textContent += character;
    element.dispatchEvent(
      new KeyboardEvent("keydown", { key: character, bubbles: true }),
    );
    element.dispatchEvent(
      new KeyboardEvent("keyup", { key: character, bubbles: true }),
    );
  });
  await settle();
};

const unmount = async ({ container, root }) => {
  await act(() => root.unmount());
  document.body.removeChild(container);
};

describe("Editor", () => {
  it("renders the code as highlighted tokens", () => {
    const { container } = render(
      <Editor code="const x = 'hi';" language="javascript" />,
    );
    expect(container.textContent).toContain("const");
    // Prism splits into per-token spans rather than emitting one text node.
    expect(container.querySelectorAll("pre span span").length).toBeGreaterThan(
      1,
    );
  });

  it("marks the editing surface as contentEditable", () => {
    const { container } = render(<Editor code="x" language="js" />);
    // use-editable sets the property imperatively; jsdom does not reflect it
    // back to an attribute, so assert on the property.
    expect(container.querySelector("pre").contentEditable).toBe(
      "plaintext-only",
    );
  });

  it("applies className and style to the wrapper", () => {
    const { container } = render(
      <Editor
        code="x"
        language="js"
        className="custom"
        style={{ fontFamily: "monospace" }}
      />,
    );
    const wrapper = container.firstChild;
    expect(wrapper.className).toBe("custom");
    expect(wrapper.style.fontFamily).toBe("monospace");
  });

  it("reflects the language in the generated class name", () => {
    const { container } = render(<Editor code="x = 1" language="python" />);
    expect(container.querySelector("pre").className).toContain(
      "language-python",
    );
  });

  it("honours a custom theme", () => {
    // jsdom normalises hex to rgb(), so compare two themes rather than
    // asserting on a literal colour value.
    const bg = (theme) =>
      render(
        <Editor code="const x = 1;" language="js" theme={theme} />,
      ).container.querySelector("pre").style.backgroundColor;

    expect(bg(themes.github)).not.toBe("");
    expect(bg(themes.github)).not.toBe(bg(themes.nightOwl));
  });

  it("updates when the code prop changes", () => {
    const { container, rerender } = render(
      <Editor code="first" language="js" />,
    );
    expect(container.textContent).toContain("first");
    rerender(<Editor code="second" language="js" />);
    expect(container.textContent).toContain("second");
  });

  it("renders multi-line code as separate lines", () => {
    const { container } = render(<Editor code={"a\nb\nc"} language="js" />);
    expect(container.querySelectorAll("pre > span").length).toBe(3);
  });

  // Regression test: `prism` was declared in Props but never forwarded to
  // <Highlight>, so a custom Prism instance was silently ignored. See #284.
  it("highlights using a custom prism instance", () => {
    const customPrism = {
      ...Prism,
      languages: {
        ...Prism.languages,
        widget: { keyword: /\bWIDGET\b/ },
      },
    };

    const withCustom = render(
      <Editor code="WIDGET here" language="widget" prism={customPrism} />,
    );
    expect(
      withCustom.container.querySelector("pre .token.keyword"),
    ).not.toBeNull();

    // The bundled Prism has never heard of "widget", so nothing is tokenised.
    const withDefault = render(<Editor code="WIDGET here" language="widget" />);
    expect(
      withDefault.container.querySelector("pre .token.keyword"),
    ).toBeNull();
  });

  // Regression test for #415.
  it("keeps the editing surface intact across the first edit", async () => {
    const rendered = await renderEditor({ code: "abc" });
    const { container, pre } = rendered;

    // jsdom has no contentEditable editing model, so it cannot reproduce the
    // focus loss itself. What it can observe is the cause: use-editable keys its
    // setup on the element ref, which is null for the first render, so a
    // re-render rebuilds the surface -- resetting `contentEditable`, which blurs
    // the element in Chrome, and calling `focus()` while it is still
    // non-editable, which silently fails. No re-render on the first edit means
    // no teardown.
    let contentEditable = pre.contentEditable;
    const contentEditableWrites = [];
    Object.defineProperty(pre, "contentEditable", {
      configurable: true,
      get: () => contentEditable,
      set: (value) => {
        contentEditableWrites.push(value);
        contentEditable = value;
      },
    });

    await typeCharacter(pre, "X");

    expect(container.querySelector("pre")).toBe(pre);
    expect(pre.textContent).toBe("abcX\n");
    expect(contentEditableWrites).toEqual([]);

    await unmount(rendered);
  });
});
