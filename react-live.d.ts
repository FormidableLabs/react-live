export as namespace ReactLive;

import { Component, StatelessComponent, HTMLAttributes } from 'react';

export type LiveProviderProps = HTMLAttributes<HTMLElement> & {
  code?: any;
  mountStylesheet?: boolean;
  noInline?: boolean;
}

export class LiveProvider extends Component<LiveProviderProps, {}>{}

export interface EditorProps extends HTMLElement {
  onChange: React.ChangeEventHandler<HTMLElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  onKeyUp: React.KeyboardEventHandler<HTMLElement>;
  onClick: React.MouseEventHandler<HTMLElement>;
  code: string;
}

export function LiveEditor(props: EditorProps): any

export function LiveError(props: HTMLAttributes<HTMLElement>): any
export function LivePreview(props: HTMLAttributes<HTMLElement>): any

export class Editor extends Component<HTMLAttributes<HTMLElement>, {}>{}

export function withLive<T>(wrappedComponent: T): Component<any, {}>
