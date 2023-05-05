/**
 * Creates a new composite function that invokes the functions from right to left
 */

export default function compose<T>(...functions: ((...args: T[]) => T)[]) {
  return functions.reduce(
    (acc, currentFn) =>
      (...args: T[]) =>
        acc(currentFn(...args))
  );
}
