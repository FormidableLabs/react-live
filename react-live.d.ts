export as namespace ReactLive;

import { Component } from 'react'

export interface LiveProviderProps {
  code: string;
  error?: string;
  onError?: Function;
  onChange?: Function;
  element?: any;
}

export class LiveProvider extends Component<LiveProviderProps, {}>{}

export interface EditorProps extends HTMLElement {
  onChange: Function;
  onKeyDown: Function;
  onKeyUp: Function;
  onClick: Function;
  code: string;
}

export function LiveEditor(props: EditorProps): any

export function LiveError(props: HTMLElement): any
export function LivePreview(props: HTMLElement): any

export class Editor extends Component<HTMLElement, {}>{}

export function withLive(wrappedComponent: Component<any, any>): Component<any, {}>
