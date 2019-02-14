import React from 'react';
import { storiesOf, action } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs/react';

import { Editor } from '../src/index';

storiesOf('Editor', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Editor language="js" code="const x = 'Hello World!';" />
  ));
