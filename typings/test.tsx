import { LiveProvider, Editor, LiveEditor, LiveError, LivePreview, withLive } from '../';
import * as React from 'react';

export const providerC = (
  <LiveProvider code={``} className="" scope="" mountStylesheet={false} noInline={false}/>
);

export const editorC = (
  <Editor/>
)

export const liveEditorC = (
  <LiveEditor/>
);

export const liveErrorC = (
  <LiveError/>
);

export const livePreviewC = (
  <LivePreview/>
);

const Component: React.StatelessComponent<{}> = () => (
  <div>Hello World!</div>
);

export const wrappedComponent = withLive(Component);
