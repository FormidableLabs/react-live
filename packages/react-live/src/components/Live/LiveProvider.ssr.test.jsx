import React, { StrictMode } from "react";
import ReactDOMServer from "react-dom/server";
import { act } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";

import LiveError from "./LiveError";
import LivePreview from "./LivePreview";
import LiveProvider from "./LiveProvider";

describe("LiveProvider SSR", () => {
  it("reuses the synchronous preview during StrictMode effect replay", async () => {
    const transformCode = vi.fn((code) => `<strong>${code}</strong>`);
    const preview = (
      <StrictMode>
        <LiveProvider code="hello" ssr transformCode={transformCode}>
          <LivePreview />
        </LiveProvider>
      </StrictMode>
    );
    const container = document.createElement("div");
    container.innerHTML = ReactDOMServer.renderToString(preview);
    const onRecoverableError = vi.fn();
    let root;
    await act(() => {
      root = hydrateRoot(container, preview, { onRecoverableError });
    });
    // StrictMode invokes the client initializer twice; the server invokes it once.
    expect(transformCode).toHaveBeenCalledTimes(3);
    expect(container.innerHTML).toMatchSnapshot();
    expect(onRecoverableError).not.toHaveBeenCalled();
    await act(() => root.unmount());
  });

  it("reports rejected transforms after hydration", async () => {
    const preview = (
      <LiveProvider
        code="hello"
        ssr
        transformCode={() => Promise.reject(new Error("transform failed"))}
      >
        <LivePreview />
        <LiveError />
      </LiveProvider>
    );
    const container = document.createElement("div");
    container.innerHTML = ReactDOMServer.renderToString(preview);
    let root;
    await act(() => {
      root = hydrateRoot(container, preview);
    });
    expect(container.innerHTML).toMatchSnapshot();
    await act(() => root.unmount());
  });

  it.each(["<div>", undefined])(
    "reports invalid async transform output %s and recovers",
    async (invalidCode) => {
      const preview = (
        <LiveProvider
          code="hello"
          ssr
          transformCode={() => Promise.resolve(invalidCode)}
        >
          <LivePreview />
          <LiveError />
        </LiveProvider>
      );
      const container = document.createElement("div");
      container.innerHTML = ReactDOMServer.renderToString(preview);
      let root;
      await act(() => {
        root = hydrateRoot(container, preview);
      });
      expect(container.innerHTML).toMatchSnapshot();
      await act(async () => {
        root.render(
          <LiveProvider
            code="fixed"
            ssr
            transformCode={() => Promise.resolve("<strong>fixed</strong>")}
          >
            <LivePreview />
            <LiveError />
          </LiveProvider>,
        );
      });
      expect(container.innerHTML).toMatchSnapshot();
      await act(() => root.unmount());
    },
  );

  it("keeps server rendering disabled by default", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <LiveProvider code="() => { throw new Error('server crash') }">
        <LivePreview />
      </LiveProvider>,
    );

    expect(html).toMatchSnapshot();
  });

  it("renders inline previews during the initial server render", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <LiveProvider code="<strong>Hello SSR!</strong>" ssr>
        <LivePreview />
      </LiveProvider>,
    );

    expect(html).toMatchSnapshot();
  });

  it("renders noInline previews during the initial server render", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <LiveProvider code="render(<strong>Hello SSR!</strong>)" noInline ssr>
        <LivePreview />
      </LiveProvider>,
    );

    expect(html).toMatchSnapshot();
  });

  it("renders transformed code when transformCode is synchronous", () => {
    const transformCode = vi.fn((code) => `<strong>${code}</strong>`);
    const html = ReactDOMServer.renderToStaticMarkup(
      <LiveProvider code="Hello SSR!" transformCode={transformCode} ssr>
        <LivePreview />
      </LiveProvider>,
    );

    expect(html).toMatchSnapshot();
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

    expect(html).toMatchSnapshot();
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
    await act(() => {
      root = hydrateRoot(container, preview, { onRecoverableError });
    });

    expect(container.innerHTML).toMatchSnapshot();
    expect(transformCode).toHaveBeenCalledTimes(2);
    expect(onRecoverableError).not.toHaveBeenCalled();

    await act(() => root.unmount());
  });

  it.each([false, true])(
    "renders an async transform after hydration (StrictMode: %s)",
    async (strict) => {
      const resolvers = [];
      const transformCode = vi.fn(() => {
        const { promise, resolve } = Promise.withResolvers();
        resolvers.push(resolve);
        return promise;
      });
      const Wrapper = strict ? StrictMode : React.Fragment;
      const preview = (
        <Wrapper>
          <LiveProvider code="Hello SSR!" transformCode={transformCode} ssr>
            <LivePreview />
          </LiveProvider>
        </Wrapper>
      );
      const container = document.createElement("div");
      container.innerHTML = ReactDOMServer.renderToString(preview);
      const onRecoverableError = vi.fn();

      let root;
      await act(() => {
        root = hydrateRoot(container, preview, { onRecoverableError });
      });

      expect(container.innerHTML).toMatchSnapshot();

      await act(() => {
        resolvers.forEach((resolve) => resolve("<strong>Hello SSR!</strong>"));
      });

      expect(container.innerHTML).toMatchSnapshot();
      expect(onRecoverableError).not.toHaveBeenCalled();
      expect(transformCode).toHaveBeenCalledTimes(strict ? 3 : 2);

      await act(() => root.unmount());
    },
  );

  it("transpiles later code updates after hydrating an SSR preview", async () => {
    const firstPreview = (
      <LiveProvider code="<strong>first</strong>" ssr>
        <LivePreview />
      </LiveProvider>
    );
    const container = document.createElement("div");
    container.innerHTML = ReactDOMServer.renderToString(firstPreview);

    let root;
    await act(() => {
      root = hydrateRoot(container, firstPreview);
    });

    await act(async () => {
      root.render(
        <LiveProvider code="<strong>second</strong>" ssr>
          <LivePreview />
        </LiveProvider>,
      );
    });

    expect(container.innerHTML).toMatchSnapshot();

    await act(() => root.unmount());
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

    expect(html).toMatchSnapshot();
  });

  it("renders noInline evaluation errors during the initial server render", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <LiveProvider code="<strong>Hello SSR!</strong>" noInline ssr>
        <LivePreview />
        <LiveError />
      </LiveProvider>,
    );

    expect(html).toMatchSnapshot();
  });
});
