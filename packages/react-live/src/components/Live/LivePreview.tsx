import React, { useContext } from "react";

import { ErrorBoundary } from "./ErrorBoundary";
import LiveContext from "./LiveContext";

type Props<T extends React.ElementType = React.ElementType> = {
  Component?: T;
} & React.ComponentPropsWithoutRef<T>;

function LivePreview<T extends keyof React.JSX.IntrinsicElements>(
  props: Props<T>,
): React.JSX.Element;
function LivePreview<T extends React.ElementType>(
  props: Props<T>,
): React.JSX.Element;

function LivePreview({ Component = "div", ...rest }: Props): React.JSX.Element {
  const { element: Element, onError, newCode } = useContext(LiveContext);

  return (
    <ErrorBoundary key={newCode} onError={onError}>
      <Component {...rest}>{Element ? <Element /> : null}</Component>
    </ErrorBoundary>
  );
}
export default LivePreview;
