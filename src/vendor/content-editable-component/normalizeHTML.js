export default html =>
  html.replace(/(<\/?div>)+/gm, "<br>").replace(/(<\/?(span|p)>)+/gm, "");
