import ShallowRenderer from "react-test-renderer/shallow";
import ReactDOMServer from "react-dom/server";

const renderShallow = (Component) => {
  const renderer = new ShallowRenderer();
  renderer.render(Component);
  return renderer.getRenderOutput();
};

export const render = (Component) =>
  ReactDOMServer.renderToStaticMarkup(renderShallow(Component)) || null;

export const shallow = (Component) => ({
  html: () => render(Component),
  text: () => renderShallow(Component).props.children,
});
