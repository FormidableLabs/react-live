---
"react-live": patch
---

Forward the `Editor` `prism` prop to `prism-react-renderer`. It was typed but never passed through, so a custom Prism instance was silently ignored.
