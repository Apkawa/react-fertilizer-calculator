import {getMultiRatio, getMultiElementRatio, calculateByMultiRatio} from "../ratio";


describe("getMultiRatio", () => {
  test("simple", () => {
    expect(getMultiRatio([80, 180, 40])).toEqual([2, 4.5, 1])
    expect(getMultiRatio([171, 86, 43])).toEqual([4, 2, 1])
    // Пров
  })
})


describe("getMultiRatio", () => {
  test("simple", () => {
    const npk = {K: 80, Ca: 180, Mg: 40}
    expect(getMultiElementRatio(npk, ['K', 'Ca', 'Mg']))
      .toEqual({
        "elements": ["K", "Ca", "Mg"],
        "matrix": {"Ca": 4.5, "K": 2, "Mg": 1},
        "ratio": [2, 4.5, 1],
        "display": "2:4.5:1",
      })
    // Пров
  })
})

describe("calculateByMultiRatio", () => {
  test("simple", () => {
    expect(calculateByMultiRatio([50, 50, 50], [2, 4, 1])).toEqual([100, 200, 50])
    expect(calculateByMultiRatio([200, 40, 50], [5, 2, 2])).toEqual([100, 40, 40])
    // Пров
  })
})
