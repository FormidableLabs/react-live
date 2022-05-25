import React, { useContext } from "react";
import { act } from "react-dom/test-utils";
import { renderElementAsync, generateElement } from "../../utils/transpile";
import { render, screen } from "@testing-library/react";
import LiveProvider from "./LiveProvider";
import LiveContext from "./LiveContext";

jest.mock("../../utils/transpile", () => {
  const orig = jest.requireActual("../../utils/transpile");
  return {
    ...orig,

    // So we still can use/run these methods
    generateElement: jest.fn().mockImplementation(orig.generateElement),
    renderElementAsync: jest.fn().mockImplementation(orig.renderElementAsync),
  };
});

function waitAsync() {
  return act(() => new Promise((resolve) => setTimeout(resolve, 0)));
}

function ErrorRenderer() {
  const { error } = useContext(LiveContext);
  return <div data-testid="handledError">{error?.message || error}</div>;
}

beforeEach(() => {
  document.body.innerHTML = "";
  jest.clearAllMocks();
});

describe("LiveProvider with skipInitialRender", () => {
  it("applies a synchronous transformCode function", (done) => {
    function transformCode(code) {
      return `render(<div>${code}</div>)`;
    }

    render(
      <LiveProvider
        code="hello"
        noInline
        transformCode={transformCode}
        skipInitialRender // do not count the initial render
      />
    );

    expect(renderElementAsync).toHaveBeenCalledTimes(0);

    waitAsync().then(() => {
      expect(generateElement).toHaveBeenCalledTimes(0);
      expect(renderElementAsync).toHaveBeenCalledTimes(1);
      expect(renderElementAsync.mock.calls[0][0].code).toBe(
        "render(<div>hello</div>)"
      );

      done();
    });
  });

  it("applies an asynchronous transformCode function", (done) => {
    function transformCode(code) {
      return Promise.resolve(`render(<div>${code}</div>)`);
    }

    render(
      <LiveProvider
        code="hello"
        noInline
        transformCode={transformCode}
        skipInitialRender // do not count the initial render
      />
    );

    expect(renderElementAsync).toHaveBeenCalledTimes(0);

    waitAsync().then(() => {
      expect(generateElement).toHaveBeenCalledTimes(0);
      expect(renderElementAsync).toHaveBeenCalledTimes(1);
      expect(renderElementAsync.mock.calls[0][0].code).toBe(
        "render(<div>hello</div>)"
      );

      done();
    });
  });

  it("catches errors from a synchronous transformCode function", (done) => {
    function transformCode() {
      throw new Error("testError");
    }

    render(
      <LiveProvider
        code="hello"
        noInline
        transformCode={transformCode}
        skipInitialRender
      >
        <ErrorRenderer />
      </LiveProvider>
    );

    waitAsync().then(() => {
      expect(generateElement).toHaveBeenCalledTimes(0);
      expect(renderElementAsync).toHaveBeenCalledTimes(0);

      const handledErrorWrapper = screen.getByTestId("handledError");
      expect(handledErrorWrapper.textContent).toBe("Error: testError");

      done();
    });
  });

  it("catches errors from an asynchronous transformCode function", (done) => {
    function transformCode() {
      return Promise.reject(new Error("testError"));
    }

    render(
      <LiveProvider
        code="hello"
        noInline
        transformCode={transformCode}
        skipInitialRender
      >
        <ErrorRenderer />
      </LiveProvider>
    );

    waitAsync().then(() => {
      expect(generateElement).toHaveBeenCalledTimes(0);
      expect(renderElementAsync).toHaveBeenCalledTimes(0);

      const handledErrorWrapper = screen.getByTestId("handledError");
      expect(handledErrorWrapper.textContent).toBe("Error: testError");

      done();
    });
  });

  it("will skip ssr render", (done) => {
    function transformCode(code) {
      return `render(<div>${code}</div>)`;
    }

    render(
      <LiveProvider
        code="hello"
        noInline
        transformCode={transformCode}
        skipInitialRender
      />
    );

    expect(generateElement).toHaveBeenCalledTimes(0);
    expect(renderElementAsync).toHaveBeenCalledTimes(0);

    waitAsync().then(() => {
      expect(generateElement).toHaveBeenCalledTimes(0);
      expect(renderElementAsync).toHaveBeenCalledTimes(1);
      expect(renderElementAsync.mock.calls[0][0].code).toBe(
        "render(<div>hello</div>)"
      );

      done();
    });
  });
});

describe("LiveProvider with ssr support", () => {
  it("will apply synchronous transformCode function on initial render", (done) => {
    function transformCode(code) {
      return `<div>${code}</div>`;
    }

    render(
      <LiveProvider
        code="hello"
        noInline={false}
        transformCode={transformCode}
      />
    );

    function assert() {
      expect(generateElement).toHaveBeenCalledTimes(1);
      expect(generateElement.mock.calls[0][0].code).toBe("<div>hello</div>");
      expect(renderElementAsync).toHaveBeenCalledTimes(0);
    }

    assert();

    waitAsync().then(() => {
      assert();
      done();
    });
  });

  it("will apply asynchronous transformCode function on initial render", (done) => {
    function transformCode(code) {
      return `render(<div>${code}</div>)`;
    }

    render(
      <LiveProvider code="hello" noInline transformCode={transformCode} />
    );

    function assert() {
      expect(generateElement).toHaveBeenCalledTimes(0);
      expect(renderElementAsync).toHaveBeenCalledTimes(1);
      expect(renderElementAsync.mock.calls[0][0].code).toBe(
        "render(<div>hello</div>)"
      );
    }

    assert();

    waitAsync().then(() => {
      assert();
      done();
    });
  });

  it("will rerender on property changes while supporting ssr", (done) => {
    const { rerender } = render(
      <LiveProvider
        code="hello"
        noInline
        transformCode={(code) => `render(<div>${code}</div>)`}
      />
    );

    expect(generateElement).toHaveBeenCalledTimes(0);
    expect(renderElementAsync).toHaveBeenCalledTimes(1);
    expect(renderElementAsync.mock.calls[0][0].code).toBe(
      "render(<div>hello</div>)"
    );

    rerender(
      <LiveProvider
        code="changed code"
        noInline
        transformCode={(code) => `render(<div>${code}</div>)`}
      />
    );

    waitAsync().then(() => {
      expect(generateElement).toHaveBeenCalledTimes(0);
      expect(renderElementAsync).toHaveBeenCalledTimes(2);
      expect(renderElementAsync.mock.calls[1][0].code).toBe(
        "render(<div>changed code</div>)"
      );

      rerender(
        <LiveProvider
          code="changed code to inline"
          transformCode={(code) => `<div>${code}</div>`}
        />
      );

      waitAsync().then(() => {
        expect(generateElement).toHaveBeenCalledTimes(1);
        expect(generateElement.mock.calls[0][0].code).toBe(
          "<div>changed code to inline</div>"
        );
        expect(renderElementAsync).toHaveBeenCalledTimes(2);

        done();
      });
    });
  });

  it("catches errors from a synchronous transformCode function", (done) => {
    function transformCode() {
      throw new Error("testError");
    }

    render(
      <LiveProvider code="hello" noInline transformCode={transformCode}>
        <ErrorRenderer />
      </LiveProvider>
    );

    function assert() {
      expect(generateElement).toHaveBeenCalledTimes(0);
      expect(renderElementAsync).toHaveBeenCalledTimes(0);

      expect(screen.getByTestId("handledError").textContent).toBe(
        "Error: testError"
      );
    }

    assert();

    waitAsync().then(() => {
      assert();
      done();
    });
  });
});
