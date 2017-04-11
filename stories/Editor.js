import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { withKnobs, boolean } from '@kadira/storybook-addon-knobs';

import { Editor } from '../src/index'

storiesOf('Editor', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Editor
      code="const x = 'Hello World!';"
      contentEditable={boolean('Content Editable', true)}
    />
  ));
