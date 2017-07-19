import { LiveProvider, Editor, LiveEditor, LiveError, LivePreview, withLive } from '../';
import * as React from 'react';

export const providerC = (
  <LiveProvider
    code="code"
    className="class"
    scope={{ Component: React.Component }}
    transformCode={(code: string): string => code + ';;'}
    mountStylesheet={false}
    noInline={false}
  />
);

export const editorC = (
  <Editor ignoreTabKey={false} />
)

export const liveEditorC = (
  <LiveEditor onChange={(code: string) => {}}/>
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
