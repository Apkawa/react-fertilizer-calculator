import {calculate_v1, calculate_v2} from "../index";
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

describe("Calculate", () => {
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
        "K": 378,
        "Ca": 170,
        "Mg": 29,
        S: 0
      },
      "score": 79,
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


describe("Calculate V2", () => {

  test("Simple ", () => {

    let NO3 = 135,
      NH4 = 4.47,
      P = 45,
      K = 279.67,
      Ca = 139,
      Mg = 55.93,
      S = 127.22
    const result = calculate_v2({
        NO3, NH4, P, K, Ca, Mg, S,
      },
      [
        buildNPKFertilizer("Сульфат магния", {Mg: 16.7, S: 13.5}),
        buildNPKFertilizer("Монофосфат калия", {P: 50, K: 33}),
        buildNPKFertilizer("Кальциевая селитра", {NO3: 11.86, Ca: 24,}),
        {id: "Нитрат аммония", composition: [{formula: "NH4NO3", percent: 98}]},
        buildNPKFertilizer("Нитрат калия", {NO3: 14, K: 46}),
        buildNPKFertilizer("Сульфат калия", {K: 50, S: 18}),
        // normalizeFertilizer(defaultFertilizers[1])
      ].map((f) => normalizeFertilizer(f),
        {accuracy: 0.01}
        )
    )
    expect(result).toEqual({
      "deltaElements": {
        "Ca": 0,
        "K": 11.67,
        "Mg": -0.07,
        "NH4": -0.53,
        "NO3": -1,
        "P": 0,
        "S": 0.22
      },
      "elements": {
        "Ca": 139,
        "K": 268,
        "Mg": 56,
        "NH4": 5,
        "NO3": 136,
        "P": 45,
        "S": 127
      },
      "fertilizers": [
        {
          "base_weight": 0,
          "id": "Сульфат магния",
          "weight": 0.6
        },
        {
          "base_weight": 0,
          "id": "Монофосфат калия",
          "weight": 0.2
        },
        {
          "base_weight": 0,
          "id": "Кальциевая селитра",
          "weight": 0.8
        },
        {
          "base_weight": 0,
          "id": "Нитрат калия",
          "weight": 0.2
        },
        {
          "base_weight": 0,
          "id": "Сульфат калия",
          "weight": 0.3
        }
      ],
      "score": 98,
      "stats": {
        "count": 0,
        "time": 0
      }
    })
  })
})
