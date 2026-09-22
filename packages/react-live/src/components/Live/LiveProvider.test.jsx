import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LiveProvider from "./LiveProvider";
import LivePreview from "./LivePreview";
import LiveError from "./LiveError";

/**
 * These scenarios are ported from the Storybook stories that used to live
 * alongside these components. Storybook was never wired into CI, so they were
 * only ever checked by eye; here they are assertions.
 */

const renderLive = (props) =>
  render(
    <LiveProvider {...props}>
      <LivePreview />
      <LiveError data-testid="live-error" />
    </LiveProvider>,
  );

describe("rendering code", () => {
  it("renders inline JSX", async () => {
    renderLive({ code: "<strong>Hello World!</strong>" });
    expect(await screen.findByText("Hello World!")).toBeDefined();
  });

  it("renders a function component", async () => {
    renderLive({ code: "() => <h3>So functional. Much wow!</h3>" });
    expect(
      await screen.findByRole("heading", { name: "So functional. Much wow!" }),
    ).toBeDefined();
  });

  it("renders a class component", async () => {
    renderLive({
      code: `class Greeting extends React.Component {
        render() { return <h3>Class component</h3> }
      }`,
    });
    expect(
      await screen.findByRole("heading", { name: "Class component" }),
    ).toBeDefined();
  });

  it("renders hooks state and responds to interaction", async () => {
    const user = userEvent.setup();
    renderLive({
      code: `function LikeButton() {
        const [likes, increaseLikes] = React.useState(0)
        return (
          <div>
            <p>{likes} likes</p>
            <button onClick={() => increaseLikes(likes + 1)}>like</button>
          </div>
        )
      }`,
    });

    expect(await screen.findByText("0 likes")).toBeDefined();
    await user.click(screen.getByRole("button", { name: "like" }));
    expect(await screen.findByText("1 likes")).toBeDefined();
  });

  it("requires `render` to be called when noInline is set", async () => {
    renderLive({
      noInline: true,
      code: `const Hi = () => <h3>No inline</h3>
        render(<Hi />)`,
    });
    expect(
      await screen.findByRole("heading", { name: "No inline" }),
    ).toBeDefined();
  });

  it("reports an error when noInline code never calls render", async () => {
    renderLive({ noInline: true, code: "<h3>nope</h3>" });
    expect(
      await screen.findByText(/No-Inline evaluations must call `render`/),
    ).toBeDefined();
  });

  it("exposes values passed via scope", async () => {
    renderLive({
      code: "<span>{greeting}</span>",
      scope: { greeting: "hello from scope" },
    });
    expect(await screen.findByText("hello from scope")).toBeDefined();
  });

  it("re-transpiles when the code prop changes", async () => {
    const { rerender } = render(
      <LiveProvider code="<h3>first</h3>">
        <LivePreview />
      </LiveProvider>,
    );
    expect(await screen.findByRole("heading", { name: "first" })).toBeDefined();

    rerender(
      <LiveProvider code="<h3>second</h3>">
        <LivePreview />
      </LiveProvider>,
    );
    expect(
      await screen.findByRole("heading", { name: "second" }),
    ).toBeDefined();
  });
});

describe("TypeScript", () => {
  const tsCode = `const greet = (name: string): string => \`Hi \${name}\`
    render(<h3>{greet("TS")}</h3>)`;

  it("strips TypeScript syntax by default", async () => {
    renderLive({ code: tsCode, noInline: true });
    expect(await screen.findByRole("heading", { name: "Hi TS" })).toBeDefined();
  });

  it("errors on TypeScript syntax when enableTypeScript is false", async () => {
    renderLive({ code: tsCode, noInline: true, enableTypeScript: false });
    expect(await screen.findByTestId("live-error")).toBeDefined();
  });
});

describe("errors", () => {
  it("surfaces a syntax error", async () => {
    renderLive({ code: "<div>" });
    expect(await screen.findByTestId("live-error")).toBeDefined();
  });

  it("recovers once the code becomes valid again", async () => {
    const { rerender } = render(
      <LiveProvider code="<div>">
        <LivePreview />
        <LiveError data-testid="live-error" />
      </LiveProvider>,
    );
    expect(await screen.findByTestId("live-error")).toBeDefined();

    rerender(
      <LiveProvider code="<h3>fixed</h3>">
        <LivePreview />
        <LiveError data-testid="live-error" />
      </LiveProvider>,
    );
    expect(await screen.findByRole("heading", { name: "fixed" })).toBeDefined();
  });

  it("renders nothing when there is no error", async () => {
    render(
      <LiveProvider code="<h3>fine</h3>">
        <LivePreview />
        <LiveError data-testid="live-error" />
      </LiveProvider>,
    );
    // Wait for the successful render before asserting the absence of an error,
    // otherwise this passes simply because nothing has happened yet.
    await screen.findByRole("heading", { name: "fine" });
    expect(screen.queryByTestId("live-error")).toBeNull();
  });
});

/**
 * The previous versions of these four tests asserted nothing: they chained off
 * React's `act()` thenable, which is not a real Promise, so the runner never
 * awaited them and the callbacks ran after the test had already passed.
 */
describe("transformCode", () => {
  it("applies a synchronous transformCode function", async () => {
    renderLive({
      code: "hello",
      noInline: true,
      transformCode: (code) => `render(<div>${code}</div>)`,
    });
    expect(await screen.findByText("hello")).toBeDefined();
  });

  it("applies an asynchronous transformCode function", async () => {
    renderLive({
      code: "hello",
      noInline: true,
      transformCode: (code) => Promise.resolve(`render(<div>${code}</div>)`),
    });
    expect(await screen.findByText("hello")).toBeDefined();
  });

  it("catches errors from a synchronous transformCode function", async () => {
    renderLive({
      code: "hello",
      noInline: true,
      transformCode: () => {
        throw new Error("testError");
      },
    });
    expect(await screen.findByText(/testError/)).toBeDefined();
  });

  it("catches errors from an asynchronous transformCode function", async () => {
    renderLive({
      code: "hello",
      noInline: true,
      transformCode: () => Promise.reject(new Error("testError")),
    });
    expect(await screen.findByText(/testError/)).toBeDefined();
  });
});
