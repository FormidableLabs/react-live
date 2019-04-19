import { ComponentClass, StatelessComponent, HTMLProps, ComponentType } from 'react'

// Helper types
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// React Element Props
type DivProps = HTMLProps<HTMLDivElement>
type PreProps = HTMLProps<HTMLPreElement>

type Theme = any

// LiveProvider
export type LiveProviderProps = Omit<DivProps, 'scope'> & {
  scope?: { [key: string]: any };
  code?: string;
  noInline?: boolean;
  transformCode?: (code: string) => string;
  theme?: Theme;
}

export const LiveProvider: ComponentClass<LiveProviderProps>

// Editor
export type EditorProps = PreProps & {
  ignoreTabKey?: boolean;
}

export const Editor: ComponentClass<EditorProps>

// LiveEditor
export type LiveEditorProps = Omit<EditorProps, 'onChange'> & {
  onChange?: (code: string) => void;
  theme?: Theme;
}

export const LiveEditor: ComponentClass<LiveEditorProps>

// LiveError
export const LiveError: ComponentClass<DivProps>

// LivePreview
export const LivePreview: ComponentClass<DivProps>

// withLive HOC
export function withLive<P>(wrappedComponent: ComponentType<P>): ComponentClass<P>
