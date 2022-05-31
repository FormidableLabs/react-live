import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CodeEditor from "./index";

describe("CodeEditor", () => {
  it("should render pre element", () => {
    const code = /* jsx */ `render(<div>code</div>)`;

    render(<CodeEditor code={code} data-testid="code-editor" />);

    const preElement = screen.getByTestId("code-editor");

    expect(preElement.tagName).toBe("PRE");
  });

  it("should forward props to pre element", () => {
    const code = /* jsx */ `render(<div>code</div>)`;

    render(
      <CodeEditor
        code={code}
        data-testid="code-editor"
        aria-label="custom-label"
      />
    );

    const preElement = screen.getByTestId("code-editor");

    expect(preElement.getAttribute("aria-label")).toBe("custom-label");
  });

  it("should omit v2 props", () => {
    const code = /* jsx */ `render(<div>code</div>)`;

    render(
      <CodeEditor
        code={code}
        data-testid="code-editor"
        textareaId="id"
        ignoreTabKey="id"
        padding={0}
      />
    );

    const preElement = screen.getByTestId("code-editor");

    const attributes = Array.from(preElement.attributes).map(
      (attr) => attr.name
    );
    expect(attributes).toEqual(["class", "style", "spellcheck", "data-testid"]);
  });

  it("should support custom ref given by editorRef", () => {
    const ref = React.createRef();
    const code = /* jsx */ `render(<div>code</div>)`;

    render(
      <CodeEditor code={code} data-testid="code-editor" editorRef={ref} />
    );

    const preElement = screen.getByTestId("code-editor");

    expect(ref.current).toBe(preElement);
  });

  it("should forward onFocus and onBlur", () => {
    const code = /* jsx */ `render(<div>code</div>)`;

    const onFocus = jest.fn();
    const onBlur = jest.fn();

    render(
      <CodeEditor
        code={code}
        data-testid="code-editor"
        onFocus={onFocus}
        onBlur={onBlur}
      />
    );

    const preElement = screen.getByTestId("code-editor");

    fireEvent.focus(preElement);
    expect(onFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(preElement);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
