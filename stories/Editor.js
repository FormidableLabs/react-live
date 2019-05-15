import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';

import { Editor } from '../src/index';

storiesOf('Editor', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Editor language="js" code="const x = 'Hello World!';" />
  ));
