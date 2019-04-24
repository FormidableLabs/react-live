import {
  LiveProvider,
  Editor,
  LiveEditor,
  LiveError,
  LivePreview,
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

export const editorC = <Editor ignoreTabKey={false} />;

export const liveEditorC = <LiveEditor onChange={(code: string) => {}} />;

export const liveErrorC = <LiveError />;

export const livePreviewC = <LivePreview />;

const Component: React.StatelessComponent<{}> = () => <div>Hello World!</div>;

export const wrappedComponent = withLive(Component);
