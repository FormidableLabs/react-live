import React, { useContext, Component } from "react";
import LiveContext from "./LiveContext";

type Props<T extends React.ElementType = React.ElementType> = {
  Component?: T;
} & React.ComponentPropsWithoutRef<T>;

class ErrorBoundary extends Component<
  {
    children: React.ReactNode;
    onError?: (error: Error) => void;
  },
  { hasError: boolean }
> {
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  constructor(props: {
    children: React.ReactNode;
    onError: (error: Error) => void;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(err: Error): void {
    this.props.onError?.(err);
  }

  render() {
    return this.props.children;
  }
}

function LivePreview<T extends keyof JSX.IntrinsicElements>(
  props: Props<T>
): JSX.Element;
function LivePreview<T extends React.ElementType>(props: Props<T>): JSX.Element;

function LivePreview({ Component = "div", ...rest }: Props): JSX.Element {
  const { element: Element, onError, code } = useContext(LiveContext);

  return (
    <ErrorBoundary
      key={code}
      onError={(err) => {
        onError(err);
      }}
    >
      <Component {...rest}>{Element ? <Element /> : null}</Component>
    </ErrorBoundary>
  );
}
export default LivePreview;
