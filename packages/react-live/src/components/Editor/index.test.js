import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import Editor from "./index";

// React 18 only treats `act` as supported when this flag is set.
global.IS_REACT_ACT_ENVIRONMENT = true;

const settle = () =>
  act(() => new Promise((resolve) => setTimeout(resolve, 0)));

const textNodes = (element) => {
  const nodes = [];
  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) nodes.push(node);
    node.childNodes.forEach(walk);
  };
  walk(element);
  return nodes;
};

// The editor renders a trailing newline text node after the code, so the caret
// goes at the end of the last text node that actually holds source.
const codeTextNode = (element) =>
  textNodes(element)
    .filter((node) => node.textContent.trim() !== "")
    .pop();

const renderEditor = async (props) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(<Editor language="javascript" {...props} />);
  });

  const pre = container.querySelector("pre");
  // jsdom does not treat the contenteditable property that use-editable sets as
  // focusable, so give the element a tabIndex in order to focus it.
  pre.setAttribute("tabindex", "0");

  await act(async () => {
    pre.focus();
    const node = codeTextNode(pre);
    const range = document.createRange();
    range.setStart(node, node.textContent.length);
    range.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    // use-editable records the caret from the browser's selectstart event.
    pre.dispatchEvent(new Event("selectstart", { bubbles: true }));
  });

  return { container, root, pre };
};

// use-editable reacts to the DOM mutation the browser makes while typing and
// flushes it on keyup, so replicating that sequence exercises the same path.
const typeCharacter = async (element, character) => {
  await act(async () => {
    codeTextNode(element).textContent += character;
    element.dispatchEvent(
      new KeyboardEvent("keydown", { key: character, bubbles: true })
    );
    element.dispatchEvent(
      new KeyboardEvent("keyup", { key: character, bubbles: true })
    );
  });
  await settle();
};

const unmount = async ({ container, root }) => {
  await act(async () => root.unmount());
  document.body.removeChild(container);
};

it("keeps the editing surface intact across the first edit", async () => {
  const rendered = await renderEditor({ code: "abc" });
  const { container, pre } = rendered;

  // jsdom has no contentEditable editing model, so it cannot reproduce the
  // focus loss itself. What it can observe is the cause: use-editable keys its
  // setup on the element ref, which is null for the first render, so a
  // re-render rebuilds the surface -- resetting `contentEditable`, which blurs
  // the element in Chrome, and calling `focus()` while it is still
  // non-editable, which silently fails. No re-render on the first edit means
  // no teardown. See FormidableLabs/react-live#415.
  let contentEditable = pre.contentEditable;
  const contentEditableWrites = [];
  Object.defineProperty(pre, "contentEditable", {
    configurable: true,
    get: () => contentEditable,
    set: (value) => {
      contentEditableWrites.push(value);
      contentEditable = value;
    },
  });

  await typeCharacter(pre, "X");

  expect(container.querySelector("pre")).toBe(pre);
  expect(pre.textContent).toBe("abcX\n");
  expect(contentEditableWrites).toEqual([]);

  await unmount(rendered);
});
