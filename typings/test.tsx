import * as React from "react";
import {
  Editor,
  LiveContext,
  LiveEditor,
  LiveError,
  LivePreview,
  LiveProvider,
  withLive,
} from "../";

export const providerC = (
  <LiveProvider
    code="code"
    className="class"
    scope={{ Component: React.Component }}
    transformCode={(code: string): string => code + ";;"}
    noInline={false}
    language="typescript"
    theme={{
      plain: {
        fontWeight: "800",
        color: "salmon",
      },
      styles: [],
    }}
    onChange={(code) => {}}
  />
);

export const editorC = (
  <Editor onChange={(code: string) => {}} code="code" disabled={false} />
);

export const liveEditorC = <LiveEditor onChange={(code: string) => {}} />;

export const liveErrorC = <LiveError />;

export const customError = () => (
  <LiveContext.Consumer>
    {({ error }) => (error ? <pre>{error}</pre> : null)}
  </LiveContext.Consumer>
);

export const livePreviewC = <LivePreview />;

export const liveCustomPreviewC = (
  <LivePreview Component={(props) => <div {...props} />} />
);

type BoxProps = { padding: string; children: React.ReactNode };
const Box = ({ padding, children }: BoxProps) => (
  <div style={{ padding }}>{children}</div>
);

export const liveCustomPreviewWithExtraPropsC = (
  <LivePreview Component={Box} padding="2px" />
);

const Component: React.StatelessComponent<{}> = () => <div>Hello World!</div>;

export const wrappedComponent = withLive(Component);
