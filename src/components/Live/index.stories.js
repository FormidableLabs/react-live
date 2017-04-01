import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Live from './index'

storiesOf('Live', module)
  .add('default', () => (
    <Live
      code="<strong>Hello World!</strong>"
    />
  ));
