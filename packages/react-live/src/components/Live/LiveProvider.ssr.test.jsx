import React from "react";
import ReactDOMServer from "react-dom/server";
import { act } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";

import LiveError from "./LiveError";
import LivePreview from "./LivePreview";
import LiveProvider from "./LiveProvider";

describe("LiveProvider SSR", () => {
  it("keeps server rendering disabled by default", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <LiveProvider code="() => { throw new Error('server crash') }">
        <LivePreview />
      </LiveProvider>,
    );

    expect(html).toBe("<div></div>");
  });

  it("renders inline previews during the initial server render", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <LiveProvider code="<strong>Hello SSR!</strong>" ssr>
        <LivePreview />
      </LiveProvider>,
    );

    expect(html).toBe("<div><strong>Hello SSR!</strong></div>");
  });

  it("renders noInline previews during the initial server render", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <LiveProvider code="render(<strong>Hello SSR!</strong>)" noInline ssr>
        <LivePreview />
      </LiveProvider>,
    );

    expect(html).toBe("<div><strong>Hello SSR!</strong></div>");
  });

  it("renders transformed code when transformCode is synchronous", () => {
    const transformCode = vi.fn((code) => `<strong>${code}</strong>`);
    const html = ReactDOMServer.renderToStaticMarkup(
      <LiveProvider code="Hello SSR!" transformCode={transformCode} ssr>
        <LivePreview />
      </LiveProvider>,
    );

    expect(html).toBe("<div><strong>Hello SSR!</strong></div>");
    expect(transformCode).toHaveBeenCalledOnce();
  });

  it("defers the preview when transformCode resolves asynchronously", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <LiveProvider
        code="Hello SSR!"
        transformCode={(code) => Promise.resolve(`<strong>${code}</strong>`)}
        ssr
      >
        <LivePreview />
      </LiveProvider>,
    );

    expect(html).toBe("<div></div>");
  });

  it("does not repeat a synchronous transform after hydration", async () => {
    const transformCode = vi.fn((code) => `<strong>${code}</strong>`);
    const preview = (
      <LiveProvider code="Hello SSR!" transformCode={transformCode} ssr>
        <LivePreview />
      </LiveProvider>
    );
    const container = document.createElement("div");
    container.innerHTML = ReactDOMServer.renderToString(preview);
    const onRecoverableError = vi.fn();

    let root;
    await act(async () => {
      root = hydrateRoot(container, preview, { onRecoverableError });
    });

    expect(container.innerHTML).toBe("<div><strong>Hello SSR!</strong></div>");
    expect(transformCode).toHaveBeenCalledTimes(2);
    expect(onRecoverableError).not.toHaveBeenCalled();

    await act(async () => root.unmount());
  });

  it("renders an asynchronous transform after hydration", async () => {
    const resolvers = [];
    const transformCode = vi.fn(
      () =>
        new Promise((resolve) => {
          resolvers.push(resolve);
        }),
    );
    const preview = (
      <LiveProvider code="Hello SSR!" transformCode={transformCode} ssr>
        <LivePreview />
      </LiveProvider>
    );
    const container = document.createElement("div");
    container.innerHTML = ReactDOMServer.renderToString(preview);
    const onRecoverableError = vi.fn();

    let root;
    await act(async () => {
      root = hydrateRoot(container, preview, { onRecoverableError });
    });

    expect(container.innerHTML).toBe("<div></div>");

    await act(async () => {
      resolvers.forEach((resolve) => resolve("<strong>Hello SSR!</strong>"));
    });

    expect(container.innerHTML).toBe("<div><strong>Hello SSR!</strong></div>");
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(transformCode).toHaveBeenCalledTimes(2);

    await act(async () => root.unmount());
  });

  it("transpiles later code updates after hydrating an SSR preview", async () => {
    const firstPreview = (
      <LiveProvider code="<strong>first</strong>" ssr>
        <LivePreview />
      </LiveProvider>
    );
    const container = document.createElement("div");
    container.innerHTML = ReactDOMServer.renderToString(firstPreview);

    let root;
    await act(async () => {
      root = hydrateRoot(container, firstPreview);
    });

    await act(async () => {
      root.render(
        <LiveProvider code="<strong>second</strong>" ssr>
          <LivePreview />
        </LiveProvider>,
      );
    });

    expect(container.innerHTML).toBe("<div><strong>second</strong></div>");

    await act(async () => root.unmount());
  });

  it("renders transform errors during the initial server render", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <LiveProvider
        code="Hello SSR!"
        transformCode={() => {
          throw new Error("Failed to transform");
        }}
        ssr
      >
        <LivePreview />
        <LiveError />
      </LiveProvider>,
    );

    expect(html).toBe("<div></div><pre>Error: Failed to transform</pre>");
  });

  it("renders noInline evaluation errors during the initial server render", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <LiveProvider code="<strong>Hello SSR!</strong>" noInline ssr>
        <LivePreview />
        <LiveError />
      </LiveProvider>,
    );

    expect(html).toContain("No-Inline evaluations must call `render`.");
  });
});
