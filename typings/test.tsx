import {
  LiveProvider,
  Editor,
  LiveEditor,
  LiveError,
  LivePreview,
  LiveContext,
  withLive
} from '../';
import * as React from 'react';

export const providerC = (
  <LiveProvider
    code="code"
    className="class"
    scope={{ Component: React.Component }}
    transformCode={(code: string): string => code + ';;'}
    noInline={false}
    language="typescript"
    theme={{
      plain: {
        fontWeight: '800',
        color: 'salmon'
      },
      styles: []
    }}
  />
);

export const editorC = (
  <Editor onChange={(code: string) => {}} code="code" disabled={false} padding={16} />
);

export const liveEditorC = <LiveEditor onChange={(code: string) => {}} />;

export const liveErrorC = <LiveError />;

export const customError = () => (
  <LiveContext.Consumer>
    {({ error }) => (error ? <pre>{error}</pre> : null)}
  </LiveContext.Consumer>
);

export const livePreviewC = <LivePreview />;

const Component: React.StatelessComponent<{}> = () => <div>Hello World!</div>;

export const wrappedComponent = withLive(Component);
