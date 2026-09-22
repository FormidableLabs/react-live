/**
 * A light dusting of the docs-site theme so the harness feels like react-live
 * rather than a blank Vite page. Palette lifted from website/tailwind.config.js.
 *
 * Deliberately tiny: no CSS framework, no font files. The story canvas stays
 * neutral so components are judged on their own rendering.
 */
export const colors = {
  navy: "#000e38",
  green: "hsl(163 100% 45%)",
  lightGrey: "#f4f8fa",
  grey: "hsl(0 0% 85%)",
  deepGrey: "hsl(240 8% 29%)",
};

export const globalCss = `
  :root { color-scheme: light; }
  body {
    margin: 0;
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    color: ${colors.navy};
  }
  a { text-decoration: none; }
  .story-nav a:hover { color: ${colors.navy}; text-decoration: underline; }
  .story-nav a[data-selected="true"] { color: ${colors.navy}; font-weight: 600; }
  .story-nav a[data-selected="true"]::before {
    content: "";
    position: absolute;
    left: 0;
    width: 3px;
    height: 1.15em;
    background: ${colors.green};
    border-radius: 2px;
  }
`;
