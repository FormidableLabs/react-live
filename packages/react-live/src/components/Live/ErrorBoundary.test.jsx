import { render, screen } from "@testing-library/react";

import { ErrorBoundary } from "./ErrorBoundary";
import LiveProvider from "./LiveProvider";
import LivePreview from "./LivePreview";
import LiveError from "./LiveError";

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
   * `getDerivedStateFromError` makes `hasError` sticky for the lifetime of the
   * boundary instance. That is only safe because a new boundary class is built
   * on every transpile, so a fixed snippet gets a fresh one.
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
