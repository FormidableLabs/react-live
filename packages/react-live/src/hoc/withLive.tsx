import React, { ComponentType } from "react";
import LiveContext from "../components/Live/LiveContext";

type Props = {
  live: Record<string, unknown>;
};

export default function withLive<T>(
  WrappedComponent: ComponentType<T & Props>
) {
  const WithLive = (props: T) => (
    <LiveContext.Consumer>
      {(live) => <WrappedComponent live={live} {...props} />}
    </LiveContext.Consumer>
  );

  WithLive.displayName = "WithLive";
  return WithLive;
}
