import { Component, ReactNode } from "react";

type Props = {
  children: ReactNode;
  onError?: (error: Error) => void;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(err: Error): void {
    this.props.onError?.(err);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
