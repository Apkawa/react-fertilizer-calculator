import {product} from "./itertools";

test("product", () => {
  const result = Array.from(product([0.1, 0.2], [0.5, 0.6, 0.7], [8]))
  expect(result).toEqual([[0.1, 0.5, 8], [0.2, 0.5, 8], [0.1, 0.6, 8], [0.2, 0.6, 8], [0.1, 0.7, 8], [0.2, 0.7, 8]])
})
