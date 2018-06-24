export default `
.prism-code {
  display: block;
  font-family: monospace;
  white-space: pre;

  background-color: #1D1F21;
  color: #C5C8C6;

  padding: 0.5rem;
  margin: 0;

  box-sizing: border-box;
  vertical-align: baseline;
  outline: none;
  text-shadow: none;
  -webkit-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
  word-wrap: normal;
  word-break: normal;
  text-align: left;
  word-spacing: normal;
  -moz-tab-size: 2;
  -o-tab-size: 2;
  tab-size: 2;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: hsl(30, 20%, 50%);
}

.token.punctuation {
  opacity: .7;
}

.namespace {
  opacity: .7;
}

.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol {
  color: hsl(350, 40%, 70%);
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  color: hsl(75, 70%, 60%);
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string,
.token.variable {
  color: hsl(40, 90%, 60%);
}

.token.atrule,
.token.attr-value,
.token.keyword {
  color: hsl(350, 40%, 70%);
}

.token.regex,
.token.important {
  color: #e90;
}

.token.important,
.token.bold {
  font-weight: bold;
}
.token.italic {
  font-style: italic;
}

.token.entity {
  cursor: help;
}

.token.deleted {
  color: red;
}
`
