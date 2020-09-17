import {calculate_v2, calculate_v3} from "../index";
import {buildNPKFertilizer, normalizeFertilizer} from "../fertilizer";
import {getEmptyElements} from "../helpers";

const emptyElements = getEmptyElements()

describe("Calculate V2", () => {

  test("Simple ", () => {
    let NO3 = 135, NH4 = 4.47, P = 45, K = 279.67, Ca = 139, Mg = 55.93, S = 127.22
    const result = calculate_v2({
        NO3, NH4, P, K, Ca, Mg, S,
      },
      [
        {id: "Магний сернокислый", elements: {...emptyElements, Mg: 10.2, S: 13.5}},
        {id: "Калий фосфорнокислый", elements: {...emptyElements, K: 27.6, P: 21.8}},
        {id: "Кальций азотнокислый", elements: {...emptyElements, Ca: 16.97, NO3: 11.86}},
        {id: "Нитрат аммония", elements: {...emptyElements, NO3: 17, NH4: 17}},
        {id: "Калий азотнокислый", elements: {...emptyElements, K: 38.2, NO3: 13.7}},
        {id: "Калий сернокислый", elements: {...emptyElements, K: 44.9, S: 18.4}},
      ],
      {accuracy: 0.001}
    )
    expect(result).toEqual({
      "deltaElements": {
        "Ca": 0,
        "K": -0.3,
        "Mg": -0.1,
        "NH4": 0.5,
        "NO3": 1,
        "P": 0,
        "S": 0.2
      },
      "elements": {
        "Ca": 139,
        "K": 280,
        "Mg": 56,
        "NH4": 4,
        "NO3": 134,
        "P": 45,
        "S": 127
      },
      "fertilizers": [
        {"base_weight": 0.548, "id": "Магний сернокислый", "weight": 0.548},
        {"base_weight": 0.206, "id": "Калий фосфорнокислый", "weight": 0.206},
        {"base_weight": 0.819, "id": "Кальций азотнокислый", "weight": 0.819},
        {"base_weight": 0.026, "id": "Нитрат аммония", "weight": 0.026},
        {"base_weight": 0.244, "id": "Калий азотнокислый", "weight": 0.244},
        {"base_weight": 0.289, "id": "Калий сернокислый", "weight": 0.289}
      ],
      "score": 98,
      "stats": {
        "count": 0,
        "time": 0
      }
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

  test("Сравнение расчетов с HPG", () => {
    const result = calculate_v2({
        NO3: 200, NH4: 20, P: 40, K: 180, Ca: 200, Mg: 50, S: 73,
      },
      [
        {id: "Кальций азотнокислый", elements: {...emptyElements, Ca: 16.972, NO3: 11.863}},
        {id: "Калий азотнокислый", elements: {...emptyElements, K: 38.672, NO3: 13.854}},
        {id: "Нитрат аммония", elements: {...emptyElements, NO3: 17.499, NH4: 17.499}},
        {id: "Магний сернокислый", elements: {...emptyElements, Mg: 9.8, S: 13.01}},
        {id: "Калий фосфорнокислый", elements: {...emptyElements, K: 28.731, P: 22.761}},
        {id: "Калий сернокислый", elements: {...emptyElements, K: 44.874, S: 18.401}},
      ],
      {accuracy: 0.01, solution_volume: 10}
    )
    expect(result).toEqual({
      "deltaElements": {
        "Ca": 0,
        "K": -16,
        "Mg": 0,
        "NH4": 0,
        "NO3": -20,
        "P": 31,
        "S": 0
      },
      "elements": {
        "Ca": 200,
        "K": 196,
        "Mg": 50,
        "NH4": 20,
        "NO3": 220,
        "P": 9,
        "S": 73
      },
      "fertilizers": [
        {
          "base_weight": 1.18,
          "id": "Кальций азотнокислый",
          "weight": 11.78
        },
        {
          "base_weight": 0.44,
          "id": "Калий азотнокислый",
          "weight": 4.35
        },
        {
          "base_weight": 0.11,
          "id": "Нитрат аммония",
          "weight": 1.14
        },
        {
          "base_weight": 0.51,
          "id": "Магний сернокислый",
          "weight": 5.1
        },
        {
          "base_weight": 0.04,
          "id": "Калий фосфорнокислый",
          "weight": 0.42
        },
        {
          "base_weight": 0.04,
          "id": "Калий сернокислый",
          "weight": 0.36
        }
      ],
      "score": 66,
      "stats": {
        "count": 0,
        "time": 0
      }
    })
  })
  test("Сравнение v3 расчетов с HPG ", () => {
    const result = calculate_v3({
        NO3: 200, NH4: 20, P: 40, K: 180, Ca: 200, Mg: 50, S: 73,
      },
      [
        {id: "Кальций азотнокислый", elements: {...emptyElements, Ca: 16.972, NO3: 11.863}},
        {id: "Калий азотнокислый", elements: {...emptyElements, K: 38.672, NO3: 13.854}},
        {id: "Нитрат аммония", elements: {...emptyElements, NO3: 17.499, NH4: 17.499}},
        {id: "Магний сернокислый", elements: {...emptyElements, Mg: 9.8, S: 13.01}},
        {id: "Калий фосфорнокислый", elements: {...emptyElements, K: 28.731, P: 22.761}},
        {id: "Калий сернокислый", elements: {...emptyElements, K: 44.874, S: 18.401}},
      ],
      {accuracy: 0.01, solution_volume: 10}
    )
    expect(result).toMatchObject({
      "deltaElements": {
        "Ca": 0,
        "K": 2,
        "Mg": 0,
        "NH4": 0,
        "NO3": 0,
        "P": 0,
        "S": 0
      },
      "elements": {
        "Ca": 200,
        "K": 178,
        "Mg": 50,
        "NH4": 20,
        "NO3": 200,
        "P": 40,
        "S": 73
      },
      "fertilizers": [
        {
          "base_weight": 1.18,
          "id": "Кальций азотнокислый",
          "weight": 11.78
        },
        {
          "base_weight": 0.11,
          "id": "Нитрат аммония",
          "weight": 1.14
        },
        {
          "base_weight": 0.29,
          "id": "Калий азотнокислый",
          "weight": 2.9
        },
        {
          "base_weight": 0.51,
          "id": "Магний сернокислый",
          "weight": 5.1
        },
        {
          "base_weight": 0.18,
          "id": "Калий фосфорнокислый",
          "weight": 1.76
        },
        {
          "base_weight": 0.04,
          "id": "Калий сернокислый",
          "weight": 0.36
        }
      ],
      "score": 100,
    })
  })
})
