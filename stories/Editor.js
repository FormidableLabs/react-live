import React from "react";
import Prism from "prismjs";
import { Editor } from "../src/index";

export default {
  title: "Editor",
  component: Editor,
};

const Template = (args) => <Editor {...args} />;

export const Default = Template.bind({});
Default.args = {
  language: "js",
  code: "const x = 'Hello World!';",
};

// Can't pass Prism as an arg since it is not JSON-serializable
export const PrismFromNpm = () => (
  <Editor language="js" prism={Prism} code="const x = 'Hello World!';" />
);
