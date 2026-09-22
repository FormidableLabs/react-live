import ReactDOMServer from "react-dom/server";

/**
 * A stand-in for the old `react-test-renderer/shallow` helper.
 *
 * React 19 removed the shallow renderer, and `react-test-renderer` is
 * deprecated wholesale. Nothing here actually needed shallow rendering: the
 * assertions only ever look at the markup a component produces, and the single
 * level the old helper peeled off was the transpile error boundary, which
 * renders its child verbatim. A full static render gives the same answers
 * without the dead dependency.
 *
 * Note that an error boundary does *not* catch during `renderToStaticMarkup`,
 * so code that throws on render throws out of here -- which is what the
 * unmounted errorBoundary tests assert. Mounted behaviour is covered
 * separately via `@testing-library/react`.
 */
const renderToMarkup = (element) =>
  ReactDOMServer.renderToStaticMarkup(element);

export const render = (element) => renderToMarkup(element) || null;

export const shallow = (element) => ({
  html: () => render(element),
  text: () => {
    const host = document.createElement("div");
    host.innerHTML = renderToMarkup(element);
    return host.textContent;
  },
});
