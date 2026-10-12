import { Component, ReactNode } from "react";

type Props = {
  children: ReactNode;
  onError?: (error: Error) => void;
  resetKey?: string;
};

type State = {
  hasError: boolean;
  resetKey?: string;
};

export class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromProps({ resetKey }: Props, state: State) {
    if (resetKey !== state.resetKey) {
      return { hasError: false, resetKey };
    }
    return null;
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, resetKey: props.resetKey };
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
