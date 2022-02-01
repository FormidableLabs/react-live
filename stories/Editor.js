import React from "react";
import Prism from "prismjs";
import { Editor } from "../src/index";

export default {
  title: "Editor",
  component: Editor,
};

const Template = (args) => <Editor {...args} />;

const defaultArgs = {
  language: "js",
  code: "const x = 'Hello World!';",
};

export const Default = Template.bind({});
Default.args = defaultArgs;

export const FontFamilyExample = Template.bind({});
FontFamilyExample.args = {
  ...defaultArgs,
  style: {
    fontFamily: "Monaco",
  },
};

// Can't pass Prism as an arg since it is not JSON-serializable
export const PrismFromNpm = () => (
  <Editor language="js" prism={Prism} code="const x = 'Hello World!';" />
);
