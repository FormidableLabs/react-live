/**
 * Creates a new composite function that invokes the functions from right to left
 * @param  {...function} functions: all the functions to invoke
 * @returns a composite function
 */
export default function compose(...functions) {
  return functions.reduce(
    (acc, currentFn) =>
      (...args) =>
        acc(currentFn(...args))
  );
}
