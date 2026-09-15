import { createRoot } from "react-dom/client";

/**
 * A ~50 line stand-in for Storybook: browse component scenarios in a dev
 * server, and let the browser tests import the very same modules.
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

function App() {
  if (params.get("only")) {
    return <Story key={selectedId} />;
  }

  const groups = [...new Set(stories.map((entry) => entry.group))];

  return (
    <div
      style={{ display: "flex", minHeight: "100vh", font: "14px system-ui" }}
    >
      <nav
        style={{
          width: 230,
          padding: "16px 12px",
          borderRight: "1px solid #e2e2e2",
        }}
      >
        {groups.map((group) => (
          <div key={group} style={{ marginBottom: 16 }}>
            <strong>{group}</strong>
            {stories
              .filter((entry) => entry.group === group)
              .map((entry) => (
                <div key={entry.id} style={{ padding: "2px 0 2px 8px" }}>
                  <a
                    href={`?story=${encodeURIComponent(entry.id)}`}
                    style={{
                      color: entry.id === selectedId ? "#0b5fff" : "#333",
                      fontWeight: entry.id === selectedId ? 600 : 400,
                    }}
                  >
                    {entry.name}
                  </a>
                </div>
              ))}
          </div>
        ))}
      </nav>
      <main style={{ flex: 1, padding: 24 }}>
        <h1 style={{ font: "600 16px system-ui", marginTop: 0 }}>
          {selected?.id ?? "No stories found"}
        </h1>
        <Story key={selectedId} />
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
