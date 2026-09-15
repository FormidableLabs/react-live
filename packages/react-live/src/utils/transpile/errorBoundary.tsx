import React, { ComponentType, Component } from "react";

const errorBoundary = (
  Element: ComponentType,
  errorCallback: (error: Error) => void,
) => {
  return class ErrorBoundary extends Component<
    Record<string, never>,
    { hasError: boolean }
  > {
    state = { hasError: false };

    static getDerivedStateFromError() {
      // Without this the boundary never updates state, so it re-renders the
      // element that just threw. React retries, warns, and the error escapes
      // to the next boundary up.
      return { hasError: true };
    }

    componentDidCatch(error: Error) {
      errorCallback(error);
    }

    render() {
      if (this.state.hasError) {
        return null;
      }

      return typeof Element === "function" ? (
        <Element />
      ) : React.isValidElement(Element) ? (
        Element
      ) : null;
    }
  };
};

export default errorBoundary;
