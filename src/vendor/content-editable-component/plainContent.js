export const htmlToPlain = html =>
  html.replace(/(<br>)+/gm, "\n").replace(/<\/?.+?>/gm, "");
  //.replace( (/\S\n$/gm), "$&\n")
