import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { withKnobs, boolean } from '@kadira/storybook-addon-knobs';

import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from '../src/index'

storiesOf('Live', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <LiveProvider
      code="<strong>Hello World!</strong>"
      noInline={boolean('No inline evaluation', false)}
    >
      <LiveEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  ));
