import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Editor from './index'

storiesOf('Editor', module)
  .add('default', () => (
    <Editor code="const x = 'Hello World!';" />
  ));
