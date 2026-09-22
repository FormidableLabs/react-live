import React, { ComponentType } from "react";
import LiveContext from "../components/Live/LiveContext";
import type { LiveContextValue } from "../components/Live/LiveContext";

// The context already describes itself precisely; `Record<string, unknown>`
// handed every wrapped component an `unknown` for `live.element` and
// `live.error`, neither of which is usable without a cast.
type Props = {
  live: LiveContextValue;
};

export default function withLive<T>(
  WrappedComponent: ComponentType<T & Props>,
) {
  const WithLive = (props: T) => (
    <LiveContext.Consumer>
      {(live) => <WrappedComponent live={live} {...props} />}
    </LiveContext.Consumer>
  );

  WithLive.displayName = "WithLive";
  return WithLive;
}
