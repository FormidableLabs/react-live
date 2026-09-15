---
"react-live": patch
---

Stop emitting React's `__self` and `__source` debug props from transpiled code.

Sucrase adds these props to every element it compiles. They describe a source file, and there
is no source file here -- the code comes from a live editor rather than from disk, so the
filename sucrase emitted was always the empty string. React ignores both props, and React 19
additionally treats `__self` as the signature of an outdated JSX transform, logging
"Your app (or one of its dependencies) is using an outdated JSX transform" to the console of
every page rendering a `LiveProvider`.

Transpiling with sucrase's `production` option drops both props, and with them the
`_jsxFileName` constant that the transform pipeline used to splice out and re-add solely to
keep `__source` resolvable.
