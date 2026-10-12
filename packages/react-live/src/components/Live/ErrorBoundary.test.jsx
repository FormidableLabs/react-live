import { useContext, useEffect } from "react";
import { act, render, screen } from "@testing-library/react";

import { ErrorBoundary } from "./ErrorBoundary";
import LiveProvider from "./LiveProvider";
import LivePreview from "./LivePreview";
import LiveError from "./LiveError";
import LiveContext from "./LiveContext";

const Boom = () => {
  throw new Error("render exploded");
};

// Every throw in this file is deliberate. Two separate things would otherwise
// print it: React logs caught render errors via console.error, and it also
// re-dispatches them as a window `error` event so browser error reporting can
// see them -- which jsdom then prints as an uncaught exception. Silence both,
// or a passing run looks like a failing one.
const swallowErrorEvent = (event) => event.preventDefault();

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    window.addEventListener("error", swallowErrorEvent);
  });

  afterEach(() => {
    window.removeEventListener("error", swallowErrorEvent);
  });

  it("renders children when nothing throws", () => {
    render(
      <ErrorBoundary>
        <span>safe</span>
      </ErrorBoundary>,
    );
    expect(screen.getByText("safe")).toBeDefined();
  });

  it("renders nothing and reports when a child throws", () => {
    const onError = vi.fn();
    const { container } = render(
      <ErrorBoundary onError={onError}>
        <Boom />
      </ErrorBoundary>,
    );

    expect(container.innerHTML).toBe("");
    expect(onError).toHaveBeenCalledOnce();
    expect(onError.mock.calls[0][0].message).toBe("render exploded");
  });

  it("does not require an onError handler", () => {
    expect(() =>
      render(
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>,
      ),
    ).not.toThrow();
  });

  it("surfaces a runtime error from previewed code through LiveError", async () => {
    render(
      <LiveProvider code="() => { throw new Error('runtime boom') }">
        <LivePreview />
        <LiveError data-testid="live-error" />
      </LiveProvider>,
    );
    expect(await screen.findByText(/runtime boom/)).toBeDefined();
  });

  /**
   * #413. `() => []` is a valid effect callback that returns an array, so React
   * only trips over it when it runs the returned value as the cleanup -- which
   * happens when the preview element is replaced by an edit. The boundary used
   * to be keyed on the code, so it was removed in the same commit as the element
   * it was meant to catch, and the throw ran all the way up to the app's root
   * boundary. Here the outer ErrorBoundary stands in for that root boundary: if
   * the throw reaches it the whole page is gone, not just the preview.
   *
   * `LiveEditor`'s onChange is what a paste calls; jsdom has no contentEditable
   * editing model, so the edit is driven through the same callback it wires up.
   */
  it("keeps an effect cleanup error inside the preview when the code changes", async () => {
    const onPageError = vi.fn();
    let changeCode;
    const CaptureOnChange = () => {
      const { onChange } = useContext(LiveContext);
      useEffect(() => {
        changeCode = onChange;
      }, [onChange]);
      return null;
    };

    render(
      <ErrorBoundary onError={onPageError}>
        <LiveProvider code="<h3>first</h3>">
          <CaptureOnChange />
          <LivePreview />
          <LiveError data-testid="live-error" />
        </LiveProvider>
      </ErrorBoundary>,
    );
    expect(await screen.findByRole("heading", { name: "first" })).toBeDefined();

    await act(async () => changeCode("() => { React.useEffect(() => []) }"));
    await act(async () => changeCode("<h3>second</h3>"));

    expect(onPageError).not.toHaveBeenCalled();
    expect((await screen.findByTestId("live-error")).textContent).toMatch(
      /destroy is not a function/,
    );

    await act(async () => changeCode("<h3>third</h3>"));
    expect(await screen.findByRole("heading", { name: "third" })).toBeDefined();
  });

  /**
   * `getDerivedStateFromError` makes `hasError` sticky for the lifetime of the
   * boundary instance, so `LivePreview` clears it from the new code through
   * `resetKey` rather than remounting the boundary (see #413).
   */
  it("recovers once erroring code is fixed", async () => {
    const ui = (code) => (
      <LiveProvider code={code}>
        <LivePreview />
        <LiveError data-testid="live-error" />
      </LiveProvider>
    );

    const { rerender } = render(ui("() => { throw new Error('boom') }"));
    expect(await screen.findByTestId("live-error")).toBeDefined();

    rerender(ui("<h3>recovered</h3>"));
    expect(
      await screen.findByRole("heading", { name: "recovered" }),
    ).toBeDefined();
  });

  it("survives being broken and fixed repeatedly", async () => {
    const ui = (code) => (
      <LiveProvider code={code}>
        <LivePreview />
        <LiveError data-testid="live-error" />
      </LiveProvider>
    );

    const { rerender } = render(ui("<h3>ok1</h3>"));
    expect(await screen.findByRole("heading", { name: "ok1" })).toBeDefined();

    rerender(ui("() => { throw new Error('boom') }"));
    expect(await screen.findByTestId("live-error")).toBeDefined();

    rerender(ui("<h3>ok2</h3>"));
    expect(await screen.findByRole("heading", { name: "ok2" })).toBeDefined();
  });
});
