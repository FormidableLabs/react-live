import React, { useContext } from "react";
import { act } from "react-dom/test-utils";
import { renderElementAsync } from "../../utils/transpile";
import { render } from "../../utils/test/renderer";
import LiveProvider from "./LiveProvider.tsx";
import LiveContext from "./LiveContext.ts";

vi.mock("../../utils/transpile");

/*
 * TODO: every test in this file is currently skipped, because none of them have
 * ever asserted anything. Two problems compound:
 *
 * 1. `waitAsync()` returns React's `act()` thenable, which is not a real Promise.
 *    `thenable.then(cb)` returns undefined, so `return waitAsync().then(...)` was
 *    never awaited by the runner -- the test passed, then the callback ran (and
 *    threw) afterwards. Jest swallowed that entirely; Vitest reports it as an
 *    unhandled error, which is how it was found.
 * 2. Even with that fixed, `render()` uses a *shallow* renderer, which does not
 *    run effects. `transformCode` is therefore never invoked and
 *    `renderElementAsync` is called 0 times. Verified by awaiting a real
 *    `act(async () => ...)`: the assertions then fail outright.
 *
 * Additionally the last two use `wrapper.find(...)` on the markup *string*
 * returned by `renderToStaticMarkup`, which has no such method.
 *
 * Making these real requires rendering with `react-dom/client` and asserting
 * after the awaited state update. Skipped rather than deleted so the intent
 * survives for whoever rewrites them.
 */

function waitAsync() {
  return act(() => new Promise((resolve) => setTimeout(resolve, 0)));
}

it.skip("applies a synchronous transformCode function", () => {
  function transformCode(code) {
    return `render(<div>${code}</div>)`;
  }

  render(<LiveProvider code="hello" noInline transformCode={transformCode} />);

  return waitAsync().then(() => {
    expect(renderElementAsync).toHaveBeenCalledTimes(1);
    expect(renderElementAsync.mock.calls[0][0].code).toBe(
      "render(<div>hello</div>)",
    );
  });
});

it.skip("applies an asynchronous transformCode function", () => {
  function transformCode(code) {
    return Promise.resolve(`render(<div>${code}</div>)`);
  }

  render(<LiveProvider code="hello" noInline transformCode={transformCode} />);

  return waitAsync().then(() => {
    expect(renderElementAsync).toHaveBeenCalledTimes(1);
    expect(renderElementAsync.mock.calls[0][0].code).toBe(
      "render(<div>hello</div>)",
    );
  });
});

function ErrorRenderer() {
  const { error } = useContext(LiveContext);
  return <div data-testid="handledError">{error?.message}</div>;
}

it.skip("catches errors from a synchronous transformCode function", () => {
  function transformCode() {
    throw new Error("testError");
  }

  const wrapper = render(
    <LiveProvider code="hello" noInline transformCode={transformCode}>
      <ErrorRenderer />
    </LiveProvider>,
  );

  return waitAsync().then(() => {
    expect(renderElementAsync).not.toHaveBeenCalled();

    const handledErrorWrapper = wrapper.find('[data-testid="handledError"]');
    expect(handledErrorWrapper.text()).toBe("testError");
  });
});

it.skip("catches errors from an asynchronous transformCode function", () => {
  function transformCode() {
    return Promise.reject(new Error("testError"));
  }

  const wrapper = render(
    <LiveProvider code="hello" noInline transformCode={transformCode}>
      <ErrorRenderer />
    </LiveProvider>,
  );

  return waitAsync().then(() => {
    expect(renderElementAsync).not.toHaveBeenCalled();

    const handledErrorWrapper = wrapper.find('[data-testid="handledError"]');
    expect(handledErrorWrapper.text()).toBe("testError");
  });
});
