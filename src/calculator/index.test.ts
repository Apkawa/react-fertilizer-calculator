import {calculate, Elements, Fertilizer} from "./index";

const emptyElement: Elements = {
  N: 0, P: 0, K: 0, Ca: 0, Mg: 0,
}

const defaultFertilizers: Fertilizer[] = [
  {
    id: "Valagro 3:11:38",
    N: 3, P: 11, K: 38, Ca: 0, Mg: 4,
  },
  {
    ...emptyElement,
    id: "Кальциевая селитра",
    N: 16, Ca: 24,
  },
  {
    ...emptyElement,
    id: "Сульфат магния", Mg: 16
  },
  {
    ...emptyElement,
    id: "Сульфат калия", K: 50
  },
  {
    ...emptyElement,
    id: "Нитрат калия",
    N: 14, K: 46
  },
]

describe("Calculate", () => {
  test("Simple ", () => {
    const result = calculate({
        N: 200,
        P: 50,
        K: 200,
        Ca: 170,
        Mg: 50,
      },
      [defaultFertilizers[0], defaultFertilizers[1]]
    )
    expect(result).toMatchObject({
      "fertilizers": [
        {
          "id": "Valagro 3:11:38",
          "weight": 1.1,
        },
        {
          "id": "Кальциевая селитра",
          "weight": 1,
        },
      ],
      "score": 74,
    })
  })
  test("Ignore Ca, Mg", () => {
    const result = calculate({
        N: 200,
        P: 50,
        K: 200,
        Ca: 170,
        Mg: 50,
      },
      defaultFertilizers,
      {ignore_Mg: true, ignore_Ca: true, accuracy: 0.01}
    )
    expect(result).toMatchObject({
      "fertilizers": [
        {
          "id": "Valagro 3:11:38",
          "weight": 0.8,
        },
        {
          "id": "Кальциевая селитра",
          "weight": 1.1,
        },
      ],
      "score": 84,
    })
  })
  test("Accuracy calculation", () => {
    const result = calculate({
        N: 200,
        P: 50,
        K: 200,
        Ca: 170,
        Mg: 50,
      },
      defaultFertilizers,
      {accuracy: 0.01}
    )
    expect(result).toMatchObject({
      "fertilizers": [
        {
          "id": "Valagro 3:11:38",
          "weight": 0.84,
        },
        {
          "id": "Кальциевая селитра",
          "weight": 1,
        },
        {
          "id": "Сульфат магния",
          "weight": 0.31,
        }
      ],
      "score": 88,
    })
  })
})
