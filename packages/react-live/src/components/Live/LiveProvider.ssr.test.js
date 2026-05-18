import React from "react";
import ReactDOMServer from "react-dom/server";

import LivePreview from "./LivePreview.tsx";
import LiveProvider from "./LiveProvider.tsx";

describe("LiveProvider SSR", () => {
  it("renders inline previews during the initial server render", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <LiveProvider code="<strong>Hello SSR!</strong>">
        <LivePreview />
      </LiveProvider>
    );

    expect(html).toBe("<div><strong>Hello SSR!</strong></div>");
  });

  it("renders noInline previews during the initial server render", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <LiveProvider code="render(<strong>Hello SSR!</strong>)" noInline>
        <LivePreview />
      </LiveProvider>
    );

    expect(html).toBe("<div><strong>Hello SSR!</strong></div>");
  });

  it("renders transformed code when transformCode is synchronous", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <LiveProvider
        code="Hello SSR!"
        transformCode={(code) => `<strong>${code}</strong>`}
      >
        <LivePreview />
      </LiveProvider>
    );

    expect(html).toBe("<div><strong>Hello SSR!</strong></div>");
  });

  it("defers the preview when transformCode resolves asynchronously", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <LiveProvider
        code="Hello SSR!"
        transformCode={(code) => Promise.resolve(`<strong>${code}</strong>`)}
      >
        <LivePreview />
      </LiveProvider>
    );

    expect(html).toBe("<div></div>");
  });
});
