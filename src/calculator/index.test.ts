import {calculate} from "./index";
import {buildNPKFertilizer, Elements, Fertilizer, FertilizerInfo, normalizeFertilizer} from "./fertilizer";


const defaultFertilizers: FertilizerInfo[] = [
  buildNPKFertilizer(
    "Valagro 3:11:38",
    {
      N: 3, P: 11, K: 38, Ca: 0, Mg: 4,
    }),
  buildNPKFertilizer("Кальциевая селитра",
    {
    N: 16, Ca: 24,
  }),
  buildNPKFertilizer("Сульфат магния", { Mg: 16 }),
  buildNPKFertilizer("Сульфат калия", { K: 50 }),
  buildNPKFertilizer("Нитрат калия", { N: 14, K: 46 })
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
      [
        normalizeFertilizer(defaultFertilizers[0]),
        normalizeFertilizer(defaultFertilizers[1])
      ]
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
      defaultFertilizers.map(normalizeFertilizer),
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
      defaultFertilizers.map(normalizeFertilizer),
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
      "score": 89,
    })
  })
})
