import Prism from "prismjs";
import { Editor } from "../../index";
import type { Story } from "@storybook/react";

export default {
  title: "Editor",
  component: Editor,
};

const Template = (args: any) => <Editor {...args} />;

const defaultArgs = {
  language: "js",
  code: "const x = 'Hello World!';",
};

export const Default: Story = Template.bind({});
Default.args = defaultArgs;

export const FontFamilyExample: Story = Template.bind({});
FontFamilyExample.args = {
  ...defaultArgs,
  style: {
    fontFamily: "Monaco",
  },
};

// Can't pass Prism as an arg since it is not JSON-serializable
export const PrismFromNpm = () => (
  <Editor
    language="javascript"
    prism={Prism as any}
    code="const x = 'Hello World!';"
  />
);
