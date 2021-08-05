import React from 'react';

import { Editor } from '../src/index';

export default {
  title: 'Editor',
  component: Editor,
}

const Template = (args) => <Editor {...args} />;

export const Default = Template.bind({});
Default.args = {
  language: "js",
  code: "const x = 'Hello World!';"
};