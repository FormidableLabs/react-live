export default html => {
  const elem = document.createElement("textarea");
  elem.innerHTML = html.replace(/<[^>]*>/g, "");

  return elem.value;
};
