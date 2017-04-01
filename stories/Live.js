import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from '../src/index'

storiesOf('Live', module)
  .add('default', () => (
    <LiveProvider
      code="<strong>Hello World!</strong>"
    >
      <LiveEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  ));
