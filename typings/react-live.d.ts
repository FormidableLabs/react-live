import { Language, PrismTheme } from "prism-react-renderer";
import { ComponentClass, ComponentType, Context, HTMLProps } from "react";
import React = require("react");

// Helper types
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// React Element Props
type DivProps = HTMLProps<HTMLDivElement>;
type PreProps = HTMLProps<HTMLPreElement>;

// LiveProvider
export type LiveProviderProps = Omit<DivProps, "scope"> & {
  scope?: { [key: string]: any };
  code?: string;
  noInline?: boolean;
  transformCode?: (code: string) => string | Promise<string>;
  language?: Language;
  disabled?: boolean;
  theme?: PrismTheme;
};

export const LiveProvider: ComponentClass<LiveProviderProps>;

// Editor
export type EditorProps = Omit<PreProps, "onChange"> & {
  code?: string;
  disabled?: boolean;
  language?: Language;
  onChange?: (code: string) => void;
  theme?: PrismTheme;
  prism?: unknown;
};

export const Editor: ComponentClass<EditorProps>;

// Context
export interface ContextProps {
  code?: string;
  language?: Language;
  theme: PrismTheme;
  disabled?: boolean;
  error?: string;
}

export const LiveContext: Context<ContextProps>;

// LiveEditor
export type LiveEditorProps = EditorProps;

export const LiveEditor: ComponentClass<LiveEditorProps>;

// LiveError
export const LiveError: ComponentClass<DivProps>;

// LivePreview
export type LivePreviewProps<T extends DivProps = DivProps> = DivProps & {
  Component?: React.ComponentType<T>;
  [key: string]: any;
};
export const LivePreview: ComponentClass<LivePreviewProps>;

// withLive HOC
export function withLive<P>(
  wrappedComponent: ComponentType<P>
): ComponentClass<P>;
