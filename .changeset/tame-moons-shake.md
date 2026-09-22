---
"react-live": patch
---

Add `getDerivedStateFromError` to the internal error boundary, so a runtime error in live code no longer logs a React warning about it.
