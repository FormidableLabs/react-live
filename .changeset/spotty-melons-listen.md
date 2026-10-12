---
"react-live": patch
---

Keep an effect cleanup error from a replaced snippet inside the preview. `LivePreview`'s error boundary was keyed on the code, so changing the code remounted it in the same commit that unmounted the element it was meant to catch. A snippet whose `useEffect` returned something other than a function (`React.useEffect(() => [])`) threw there uncatchably, and the error reached the app's root boundary and took the page down instead of showing up in `LiveError`. The boundary now stays mounted and resets its error state through a `resetKey` prop.
