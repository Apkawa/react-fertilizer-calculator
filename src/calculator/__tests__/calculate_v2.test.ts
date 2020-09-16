import {calculate_v2} from "../index";
import {buildNPKFertilizer, normalizeFertilizer} from "../fertilizer";


describe("Calculate V2", () => {

  test("Simple ", () => {
    let NO3 = 135, NH4 = 4.47, P = 45, K = 279.67, Ca = 139, Mg = 55.93, S = 127.22
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
      "deltaElements": {"Ca": 0, "K": 11.7, "Mg": -0.1, "NH4": 0.5, "NO3": 0, "P": 0, "S": 0.2},
      "elements": {"Ca": 139, "K": 268, "Mg": 56, "NH4": 4, "NO3": 135, "P": 45, "S": 127},
      "fertilizers": [
        {"base_weight": 0.6, "id": "Сульфат магния", "weight": 0.6},
        {"base_weight": 0.2, "id": "Монофосфат калия", "weight": 0.2},
        {"base_weight": 0.8, "id": "Кальциевая селитра", "weight": 0.8},
        {"base_weight": 0.2, "id": "Нитрат калия", "weight": 0.2},
        {"base_weight": 0.3, "id": "Сульфат калия", "weight": 0.3}
      ],
      "score": 98,
      "stats": {"count": 0, "time": 0}
    })
  })
  test("Нитрат аммония с профилем без NH4", () => {
    const result = calculate_v2({
        NO3: 200, NH4: 0, P: 50, K: 200, Ca: 170, Mg: 50, S: 0,
      },
      [
        {id: "Нитрат аммония", composition: [{formula: "NH4NO3", percent: 98}]},
        buildNPKFertilizer("Сульфат магния", {Mg: 16.7, S: 13.5}),
        buildNPKFertilizer("Монофосфат калия", {P: 50, K: 33}),
        buildNPKFertilizer("Кальциевая селитра", {NO3: 11.86, Ca: 24,}),
        buildNPKFertilizer("Нитрат калия", {NO3: 14, K: 46}),
        buildNPKFertilizer("Сульфат калия", {K: 50, S: 18}),
      ].map(f => normalizeFertilizer(f)),
    )
    expect(result.elements.NH4).toEqual(0)
  })
})
