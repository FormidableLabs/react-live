import { Editor } from "../../index";
import type { Story } from "@storybook/react";

export default {
  title: "Editor",
  component: Editor,
};

const Template = (args: typeof defaultArgs) => <Editor {...args} />;

const defaultArgs = {
  language: "js",
  code: "const x = 'Hello World!';",
};

export const Default: Story<typeof defaultArgs> = Template.bind({});
Default.args = defaultArgs;

export const FontFamilyExample: Story<typeof fontFamilyArgs> = Template.bind(
  {}
);
const fontFamilyArgs = {
  ...defaultArgs,
  style: {
    fontFamily: "Monaco",
  },
};
FontFamilyExample.args = fontFamilyArgs;

// Can't pass Prism as an arg since it is not JSON-serializable
export const PrismFromNpm = () => (
  <Editor language="javascript" code="const x = 'Hello World!';" />
);
