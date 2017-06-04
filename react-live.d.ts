export as namespace ReactLive;

import { Component, StatelessComponent, HTMLAttributes } from 'react';

export type LiveProviderProps = HTMLAttributes<HTMLElement> & {
  code?: any;
  mountStylesheet?: boolean;
  noInline?: boolean;
}

export class LiveProvider extends Component<LiveProviderProps, {}>{}

export function LiveEditor(props: HTMLAttributes<HTMLElement>): JSX.Element

export function LiveError(props: HTMLAttributes<HTMLElement>): JSX.Element
export function LivePreview(props: HTMLAttributes<HTMLElement>): JSX.Element

export class Editor extends Component<HTMLAttributes<HTMLElement>, {}>{}

export function withLive<T>(wrappedComponent: T): Component<any, {}>
