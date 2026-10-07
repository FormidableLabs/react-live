import { RefObject, useEffect, useState } from "react";

export default function useTabGate(
  container: RefObject<HTMLElement>,
  editor: RefObject<HTMLElement>,
  enabled = true
) {
  const [tabGate, setTabGate] = useState(false);

  const setTabIndex = (element: RefObject<HTMLElement>, index: number) =>
    element.current && (element.current.tabIndex = index);

  const resetTabIndexes = () => {
    if (container.current?.hasAttribute("tabIndex")) {
      container.current?.removeAttribute("tabIndex");
    }
    setTabIndex(editor, 0);
  };

  const containerBlur = (event: FocusEvent) => {
    if (event.relatedTarget !== container.current) resetTabIndexes();
  };

  const catchEscape = (event: KeyboardEvent) => {
    if (event.code === "Escape" && enabled) setTabGate(true);
  };

  const containerFocus = () => editor.current?.focus();

  const editorFocus = () => {
    resetTabIndexes();
    setTabGate(false);
  };

  useEffect(() => {
    container.current?.addEventListener("blur", containerBlur);
    container.current?.addEventListener("focus", containerFocus);
    editor.current?.addEventListener("keydown", catchEscape);
    editor.current?.addEventListener("focus", editorFocus);

    return () => {
      container.current?.removeEventListener("blur", containerBlur);
      container.current?.removeEventListener("focus", containerFocus);
      editor.current?.removeEventListener("keydown", catchEscape);
      editor.current?.removeEventListener("focus", editorFocus);
    };
  }, []);

  useEffect(() => {
    if (!tabGate) return;

    setTabIndex(container, 0);
    editor.current?.blur();
    setTabIndex(editor, -1);
  }, [tabGate]);

  return tabGate;
}
