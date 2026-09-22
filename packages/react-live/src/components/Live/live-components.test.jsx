import { act, render, screen } from "@testing-library/react";

import LiveProvider from "./LiveProvider";
import LivePreview from "./LivePreview";
import LiveEditor from "./LiveEditor";
import withLive from "../../hoc/withLive";

// LiveProvider transpiles inside an effect. Tests that assert synchronously
// finish before that promise resolves, so the resulting state update lands
// outside act() and React warns. Let it settle first.
const settle = () => act(async () => {});

describe("LivePreview", () => {
  it("wraps the preview in a div by default", async () => {
    const { container } = render(
      <LiveProvider code="<em>inner</em>">
        <LivePreview />
      </LiveProvider>,
    );
    expect(await screen.findByText("inner")).toBeDefined();
    expect(container.querySelector("div")).not.toBeNull();
  });

  it("honours the Component prop", async () => {
    const { container } = render(
      <LiveProvider code="<em>inner</em>">
        <LivePreview Component="section" />
      </LiveProvider>,
    );
    await screen.findByText("inner");
    expect(container.querySelector("section")).not.toBeNull();
  });

  it("forwards extra props to the wrapper element", async () => {
    render(
      <LiveProvider code="<em>inner</em>">
        <LivePreview data-testid="preview" className="wrapper" />
      </LiveProvider>,
    );
    const preview = await screen.findByTestId("preview");
    expect(preview.className).toBe("wrapper");
  });
});

describe("LiveEditor", () => {
  it("renders the provider's code", async () => {
    const { container } = render(
      <LiveProvider code="const fromProvider = 1;">
        <LiveEditor />
      </LiveProvider>,
    );
    await settle();
    expect(container.textContent).toContain("fromProvider");
  });

  it("lets explicit props override the context", async () => {
    const { container } = render(
      <LiveProvider code="const fromProvider = 1;">
        <LiveEditor code="const override = 2;" />
      </LiveProvider>,
    );
    await settle();
    expect(container.textContent).toContain("override");
    expect(container.textContent).not.toContain("fromProvider");
  });
});

describe("withLive", () => {
  it("injects the live context as a `live` prop", async () => {
    const Consumer = withLive(({ live }) => (
      <div data-testid="consumer">{live.code}</div>
    ));
    const Wrapped = () => (
      <LiveProvider code="<span>hi</span>">
        <Consumer />
      </LiveProvider>
    );

    render(<Wrapped />);
    expect((await screen.findByTestId("consumer")).textContent).toBe(
      "<span>hi</span>",
    );
  });

  it("exposes the transpiled element through context", async () => {
    const Consumer = withLive(({ live }) => {
      const Result = live.element;
      return Result ? <Result /> : null;
    });

    render(
      <LiveProvider code="<h3>from context</h3>">
        <Consumer />
      </LiveProvider>,
    );
    expect(
      await screen.findByRole("heading", { name: "from context" }),
    ).toBeDefined();
  });

  it("sets a displayName", () => {
    expect(withLive(() => null).displayName).toBe("WithLive");
  });
});
