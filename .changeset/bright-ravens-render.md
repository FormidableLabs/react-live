---
"react-live": minor
---

Add opt-in server rendering for synchronous `LiveProvider` previews.

Set the new `ssr` prop to render inline examples, `noInline` examples that call
`render(...)`, and synchronous `transformCode` output during the initial server
render. Asynchronous transforms continue after hydration. Server rendering is
disabled by default so existing examples cannot unexpectedly execute on the
server.
