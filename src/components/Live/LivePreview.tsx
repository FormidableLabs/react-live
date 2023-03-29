import React, { PropsWithChildren, useContext } from "react";
import LiveContext from "./LiveContext";

type Props = {
  Component?: React.ComponentType<PropsWithChildren<Record<string, unknown>>>;
};

const fallbackComponent = (
  props: PropsWithChildren<Record<string, unknown>>
) => <div {...props} />;

function LivePreview({ Component = fallbackComponent, ...rest }: Props) {
  const { element: Element } = useContext(LiveContext);
  return <Component {...rest}>{Element ? <Element /> : null}</Component>;
}
export default LivePreview;
