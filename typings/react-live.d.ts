import { ComponentClass, StatelessComponent, HTMLAttributes } from 'react'

// React union type
type Component<P> = ComponentClass<P> | StatelessComponent<P>

// Helper types
type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T]
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>

// React Element Props
type DivProps = HTMLAttributes<HTMLDivElement>
type PreProps = HTMLAttributes<HTMLPreElement>

// LiveProvider
export type LiveProviderProps = DivProps & {
  scope?: { [key: string]: any };
  code?: string;
  mountStylesheet?: boolean;
  noInline?: boolean;
  transformCode?: (code: string) => string;
}

export const LiveProvider: ComponentClass<LiveProviderProps>

// Editor
export type EditorProps = PreProps & {
  ignoreTabKey?: boolean;
}

export const Editor: ComponentClass<EditorProps>

// LiveEditor
export type LiveEditorProps = Omit<EditorProps, 'onChange'> & {
  onChange?: (code: string) => void
}

export const LiveEditor: ComponentClass<LiveEditorProps>

// LiveError
export const LiveError: ComponentClass<DivProps>

// LivePreview
export const LivePreview: ComponentClass<DivProps>

// withLive HOC
export function withLive<P>(wrappedComponent: Component<P>): ComponentClass<P>
