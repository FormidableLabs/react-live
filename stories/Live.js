import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs/react';

import { LiveProvider, LiveEditor, LiveError, LivePreview } from '../src/index';

const code = `
<strong>
  Hello World!
    Next Indent Level
</strong>
`.trim();

const StyledLivePreview = styled(LivePreview)`
  background: green;
  color: white;
  padding: 3px;
`;

storiesOf('Live', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <LiveProvider code={code} noInline={boolean('No inline evaluation', false)}>
      <LiveEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  ))
  .add('styled subcomponents', () => (
    <LiveProvider code={code} noInline={boolean('No inline evaluation', false)}>
      <LiveEditor />
      <LiveError />
      <StyledLivePreview />
    </LiveProvider>
  ));
