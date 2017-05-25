export as namespace ReactLive;

import { Component, StatelessComponent } from 'react'

export interface LiveProviderProps {
  code: string;
  className?: string;
  scope?: any;
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

export function LiveError(props: HTMLElement): any
export function LivePreview(props: HTMLElement): any

export class Editor extends Component<HTMLElement, {}>{}

export function withLive(wrappedComponent: Component<any, any> | StatelessComponent<any>): Component<any, {}>
