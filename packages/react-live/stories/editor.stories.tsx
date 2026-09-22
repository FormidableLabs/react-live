import { themes } from "prism-react-renderer";
import { Editor } from "react-live";

import { story } from "./story";

export const title = "Editor";

export const Default = story(Editor, {
  args: { code: "const greeting = 'Hello World!';", language: "javascript" },
});

export const MultiLine = story(Editor, {
  args: {
    code: "function add(a, b) {\n  return a + b;\n}\n\nadd(1, 2);",
    language: "javascript",
  },
});

export const TypeScript = story(Editor, {
  args: {
    code: "const add = (a: number, b: number): number => a + b;",
    language: "typescript",
  },
});

export const CustomFontFamily = story(Editor, {
  args: {
    code: "const greeting = 'Hello World!';",
    language: "javascript",
    style: { fontFamily: "'Courier New', monospace", fontSize: 18 },
  },
});

export const LightTheme = story(Editor, {
  args: {
    code: "const greeting = 'Hello World!';",
    language: "javascript",
    theme: themes.github,
  },
});

export const Disabled = story(Editor, {
  args: {
    code: "// read only",
    language: "javascript",
    disabled: true,
  },
});

/** Tab inserts two spaces. This is the default. */
export const TabIndentation = story(Editor, {
  args: {
    code: "function indented() {\n  return true;\n}",
    language: "javascript",
    tabMode: "indentation",
  },
});

/** Tab moves focus out of the editor instead of indenting -- better for a11y. */
export const TabFocus = story(Editor, {
  args: {
    code: "// press Tab to leave the editor",
    language: "javascript",
    tabMode: "focus",
  },
  render: (args) => (
    <>
      <Editor {...args} />
      <button style={{ marginTop: 8 }}>Tab should reach me</button>
    </>
  ),
});
