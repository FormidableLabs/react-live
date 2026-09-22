import { createRoot } from "react-dom/client";

import { colors, globalCss } from "./theme";

/**
 * A small stand-in for Storybook: browse component scenarios in a dev server,
 * and let the browser tests import the very same modules.
 *
 * A story is `{ args, render }`. Add a `*.stories.jsx` file and it shows up.
 *
 *   ?story=<id>   select a story
 *   ?only=1       render it bare, with no chrome (what the tests load)
 */
const modules = import.meta.glob("./*.stories.jsx", { eager: true });

export const stories = Object.entries(modules).flatMap(([path, mod]) =>
  Object.entries(mod)
    .filter(
      ([name, value]) =>
        name !== "title" &&
        value &&
        typeof value === "object" &&
        typeof value.render === "function",
    )
    .map(([name, story]) => ({
      id: `${mod.title ?? path}/${name}`,
      group: mod.title ?? path,
      name,
      story,
    })),
);

const params = new URLSearchParams(window.location.search);
const selectedId = params.get("story") ?? stories[0]?.id;
const selected = stories.find((entry) => entry.id === selectedId);

// Render through a component so stories are free to use hooks.
const Story = () =>
  selected ? selected.story.render(selected.story.args ?? {}) : null;

function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: 48,
        padding: "0 18px",
        background: colors.navy,
        color: "#fff",
        flex: "0 0 auto",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 8,
          height: 8,
          borderRadius: 2,
          background: colors.green,
        }}
      />
      <strong style={{ fontSize: 15, letterSpacing: "0.01em" }}>
        React Live
      </strong>
      <span style={{ fontSize: 13, opacity: 0.6 }}>stories</span>
      <a
        href="https://commerce.nearform.com/open-source/react-live"
        style={{ marginLeft: "auto", fontSize: 13, color: colors.green }}
      >
        Docs
      </a>
    </header>
  );
}

function Sidebar() {
  const groups = [...new Set(stories.map((entry) => entry.group))];

  return (
    <nav
      className="story-nav"
      style={{
        width: 220,
        flex: "0 0 auto",
        overflowY: "auto",
        padding: "18px 14px",
        background: colors.lightGrey,
        borderRight: `1px solid ${colors.grey}`,
        fontSize: 14,
      }}
    >
      {groups.map((group) => (
        <div key={group} style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: colors.deepGrey,
              marginBottom: 6,
            }}
          >
            {group}
          </div>
          {stories
            .filter((entry) => entry.group === group)
            .map((entry) => (
              <a
                key={entry.id}
                href={`?story=${encodeURIComponent(entry.id)}`}
                data-selected={entry.id === selectedId}
                style={{
                  position: "relative",
                  display: "block",
                  padding: "3px 0 3px 12px",
                  color: colors.deepGrey,
                }}
              >
                {entry.name}
              </a>
            ))}
        </div>
      ))}
    </nav>
  );
}

function App() {
  // Bare mode: exactly the component, nothing else. This is what tests load.
  if (params.get("only")) {
    return <Story key={selectedId} />;
  }

  return (
    <>
      <style>{globalCss}</style>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <Header />
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          <Sidebar />
          <main style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
            <h1
              style={{
                margin: "0 0 16px",
                fontSize: 13,
                fontWeight: 500,
                color: colors.deepGrey,
              }}
            >
              {selected?.id ?? "No stories found"}
            </h1>
            <Story key={selectedId} />
          </main>
        </div>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
