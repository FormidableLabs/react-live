---
"react-live": patch
---

Fix the standalone `Editor` losing focus after the first keystroke. `use-editable` rebuilt its editing surface on the first edit's re-render, which reset `contentEditable` and dropped focus; `Editor` now settles that surface before it can be edited.
