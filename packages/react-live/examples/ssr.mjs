import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { LivePreview, LiveProvider } from "../dist/index.mjs";

const preview = (ssr) =>
  renderToString(
    createElement(
      LiveProvider,
      { code: "<strong>Hello from SSR</strong>", ssr },
      createElement(LivePreview),
    ),
  );

const clientOnly = preview(false);
const serverRendered = preview(true);
assert.equal(clientOnly, "<div></div>");
assert.equal(serverRendered, "<div><strong>Hello from SSR</strong></div>");

console.log("Default:", clientOnly);
console.log("With ssr:", serverRendered);
