import { themes } from "prism-react-renderer";
import { Editor } from "react-live";

export const title = "Editor";

export const Default = {
  args: { code: "const greeting = 'Hello World!';", language: "javascript" },
  render: (args) => <Editor {...args} />,
};

export const MultiLine = {
  args: {
    code: "function add(a, b) {\n  return a + b;\n}\n\nadd(1, 2);",
    language: "javascript",
  },
  render: (args) => <Editor {...args} />,
};

export const TypeScript = {
  args: {
    code: "const add = (a: number, b: number): number => a + b;",
    language: "typescript",
  },
  render: (args) => <Editor {...args} />,
};

export const CustomFontFamily = {
  args: {
    code: "const greeting = 'Hello World!';",
    language: "javascript",
    style: { fontFamily: "'Courier New', monospace", fontSize: 18 },
  },
  render: (args) => <Editor {...args} />,
};

export const LightTheme = {
  args: {
    code: "const greeting = 'Hello World!';",
    language: "javascript",
    theme: themes.github,
  },
  render: (args) => <Editor {...args} />,
};

export const Disabled = {
  args: {
    code: "// read only",
    language: "javascript",
    disabled: true,
  },
  render: (args) => <Editor {...args} />,
};
