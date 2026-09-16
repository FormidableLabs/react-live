import { render } from "@testing-library/react";
import { Prism, themes } from "prism-react-renderer";

import Editor from "./index";

/**
 * jsdom has no contentEditable editing model, so typing cannot be simulated
 * here -- these cover rendering, highlighting, and configuration. Interaction
 * (typing, caret placement after Enter, tabMode) needs a real browser; see
 * CONTRIBUTING.
 */

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
});
