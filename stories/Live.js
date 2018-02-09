import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs/react';

import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from '../src/index'

const code = (`
<strong>
  Hello World!
    Next Indent Level
</strong>
`).trim()

storiesOf('Live', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <LiveProvider
      code={code}
      noInline={boolean('No inline evaluation', false)}
    >
      <LiveEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  ));
