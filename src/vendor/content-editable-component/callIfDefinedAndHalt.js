export default (func, e, o) => {
  if (typeof func === "function" && func(o)) {
    e.stopPropagation();
    e.preventDefault();
  }
};
