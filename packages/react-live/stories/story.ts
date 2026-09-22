import { createElement } from "react";
import type { ComponentProps, ComponentType, ReactNode } from "react";

/**
 * A story is a component plus the props to render it with.
 *
 * `args` is typed as that component's props, which is the point of the
 * exercise: a renamed or mistyped prop fails `npm run typecheck` rather than
 * surfacing during a manual browse.
 *
 * `render` is optional, and only spelled out when a scenario needs more than a
 * single element -- local state, sibling markup, a different composition.
 */
export type Story<C extends ComponentType<any>> = {
  args?: ComponentProps<C>;
  render?: (args: ComponentProps<C>) => ReactNode;
  /** This story throws on purpose; the smoke test mutes the console for it. */
  expectsError?: boolean;
};

/**
 * A story with its props type erased. Args are baked into a zero-argument
 * `render`, so the harness and the smoke test never have to name a props type
 * they cannot know -- the single unchecked step stays here, at the boundary,
 * rather than spreading into both consumers.
 */
export type StoredStory = {
  render: () => ReactNode;
  expectsError?: boolean;
};

export const story = <C extends ComponentType<any>>(
  Component: C,
  { args, render, expectsError }: Story<C> = {},
): StoredStory => ({
  expectsError,
  render: () =>
    render
      ? render(args ?? ({} as ComponentProps<C>))
      : createElement(Component, args),
});
