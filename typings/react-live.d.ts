export as namespace ReactLive;

import { Component, StatelessComponent, HTMLAttributes } from 'react';

export type LiveProviderProps = {
  className?: string;
  style?: HTMLAttributes<HTMLElement>['style'];
  scope?: { [key: string]: any };
  code?: any;
  mountStylesheet?: boolean;
  noInline?: boolean;
  transformCode?: (code: string) => string;
}

export class LiveProvider extends Component<LiveProviderProps, {}>{}

export type LiveEditorProps = {
  className?: string;
  onChange?: (code: string) => void
  style?: HTMLAttributes<HTMLElement>['style'];
  onClick?: HTMLAttributes<HTMLElement>['onClick'];
  onKeyDown?: HTMLAttributes<HTMLElement>['onKeyDown'];
  onKeyUp?: HTMLAttributes<HTMLElement>['onKeyUp'];
  onMouseOver?: HTMLAttributes<HTMLElement>['onMouseOver'];
  onMouseOut?: HTMLAttributes<HTMLElement>['onMouseOut'];
  onFocus?: HTMLAttributes<HTMLElement>['onFocus'];
  onBlur?: HTMLAttributes<HTMLElement>['onBlur'];
}

export function LiveEditor(props: LiveEditorProps): JSX.Element

export function LiveError(props: HTMLAttributes<HTMLElement>): JSX.Element
export function LivePreview(props: HTMLAttributes<HTMLElement>): JSX.Element

export type EditorProps = HTMLAttributes<HTMLElement> & {
  ignoreTabKey?: boolean;
}

export class Editor extends Component<EditorProps, {}>{}

export function withLive<T>(wrappedComponent: T): Component<any, {}>
