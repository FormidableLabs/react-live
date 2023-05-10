import React, { useContext } from "react";
import LiveContext from "./LiveContext";

type Props<T extends React.ElementType = React.ElementType> = {
  Component?: T;
} & React.ComponentPropsWithoutRef<T>;

function LivePreview<T extends keyof JSX.IntrinsicElements>(
  props: Props<T>
): JSX.Element;
function LivePreview<T extends React.ElementType>(props: Props<T>): JSX.Element;

function LivePreview({ Component = "div", ...rest }: Props): JSX.Element {
  const { element: Element } = useContext(LiveContext);
  return <Component {...rest}>{Element ? <Element /> : null}</Component>;
}
export default LivePreview;
