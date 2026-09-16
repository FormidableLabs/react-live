import React from "react";
import errorBoundary from "../transpile/errorBoundary.tsx";
import { render } from "./renderer";
import { render as rtlRender } from "@testing-library/react";

describe("errorBoundary", () => {
  it("should wrap PFCs in an error boundary", () => {
    const errorCb = vi.fn();

    const Component = errorBoundary(() => {
      throw new Error("test");
    }, errorCb);

    expect(() => render(<Component />)).toThrowError("test");
  });

  it("should wrap Components in an error boundary", () => {
    const errorCb = vi.fn();

    const Component = errorBoundary(
      class Test extends React.Component {
        // eslint-disable-next-line react/require-render-return
        render() {
          throw new Error("test");
        }
      },
      errorCb,
    );

    expect(() => render(<Component />)).toThrowError("test");
  });
});

/**
 * The boundary used to implement only `componentDidCatch`, so it never updated
 * state and re-rendered the element that had just thrown. See #228.
 *
 * Only the warning assertion below is a true regression test -- it fails if
 * `getDerivedStateFromError` is removed. The null-render assertion held before
 * the fix too (React tears the tree down either way, and its dev-mode double
 * render hides the extra attempt), so it documents behaviour rather than
 * guarding the fix.
 */
describe("errorBoundary (mounted)", () => {
  const swallow = (event) => event.preventDefault();
  let logged;

  beforeEach(() => {
    logged = [];
    vi.spyOn(console, "error").mockImplementation((...args) => {
      logged.push(String(args[0]));
    });
    window.addEventListener("error", swallow);
  });

  afterEach(() => {
    window.removeEventListener("error", swallow);
  });

  it("renders null and reports the error rather than re-throwing", () => {
    const errorCb = vi.fn();
    const Component = errorBoundary(() => {
      throw new Error("kaboom");
    }, errorCb);

    const { container } = rtlRender(<Component />);

    expect(container.innerHTML).toBe("");
    expect(errorCb).toHaveBeenCalledOnce();
    expect(errorCb.mock.calls[0][0].message).toBe("kaboom");
  });

  it("does not trigger React's missing-getDerivedStateFromError warning", () => {
    const Component = errorBoundary(() => {
      throw new Error("kaboom");
    }, vi.fn());

    rtlRender(<Component />);

    expect(
      logged.filter((entry) => entry.includes("getDerivedStateFromError")),
    ).toEqual([]);
  });
});
