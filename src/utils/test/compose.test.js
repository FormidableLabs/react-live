import compose from "../transpile/compose.ts";

describe("compose", () => {
  it("should compose functions and call the result", () => {
    const curriedAdd = (a) => (b) => b + a;
    const curriedSubtract = (a) => (b) => b - a;
    /**
     * Compose (flow right): 5 + 10 - 2 = 13
     */
    expect(compose(curriedSubtract(2), curriedAdd(10))(5)).toBe(13);
  });
});
