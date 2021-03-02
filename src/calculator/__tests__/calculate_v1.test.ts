import {calculate_v1} from "../index";
import {buildNPKFertilizer, normalizeFertilizer} from "../fertilizer";
import {FertilizerInfo} from "@/calculator/types";


const defaultFertilizers: FertilizerInfo[] = [
  buildNPKFertilizer(
    "Valagro 3:11:38",
    {
      NO3: 3, P: 11, K: 38, Ca: 0, Mg: 4,
    }),
  buildNPKFertilizer("Кальциевая селитра",
    {
      NO3: 16, Ca: 24,
    }),
  buildNPKFertilizer("Сульфат магния", {Mg: 16}),
  buildNPKFertilizer("Сульфат калия", {K: 50}),
  buildNPKFertilizer("Нитрат калия", {NO3: 14, K: 46})
]

// Disable unactual test
describe.skip("Calculate", () => {
  test("Simple ", () => {
    const result = calculate_v1({
        NO3: 200,
        NH4: 0,
        P: 50,
        K: 200,
        Ca: 170,
        Mg: 50,
        S: 0,
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
          "weight": 1.2,
        },
        {
          "id": "Кальциевая селитра",
          "weight": 1,
        },
      ],
      elements: {
        "NO3": 196,
        "NH4": 0,
        "P": 58,
        "K": 379,
        "Ca": 172,
        "Mg": 29,
        S: 0
      },
      "score": 80,
    })
  })
  test("Ignore Ca, Mg", () => {
    const result = calculate_v1({
        NO3: 200,
        NH4: 0,
        P: 50,
        K: 200,
        Ca: 170,
        Mg: 50,
        S: 0,
      },
      defaultFertilizers.map(f => normalizeFertilizer(f)),
      {ignore: {Mg: true, Ca: true}, accuracy: 0.01}
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
      "score": 90,
    })
  })
  test("Accuracy calculation", () => {
    const result = calculate_v1({
        NO3: 200,
        NH4: 0,
        P: 50,
        K: 200,
        Ca: 170,
        Mg: 50,
        S: 0,
      },
      defaultFertilizers.map(f => normalizeFertilizer(f)),
      {accuracy: 0.01}
    )
    expect(result).toMatchObject({
      "fertilizers": [
        {
          "id": "Valagro 3:11:38",
          "weight": 0.85,
        },
        {
          "id": "Кальциевая селитра",
          "weight": 1,
        },
        {
          "id": "Сульфат магния",
          "weight": 0.3,
        }
      ],
      "score": 91,
    })
  })
})


