import {calculate_v2} from "../../index";
import {buildNPKFertilizer, normalizeFertilizer} from "../../fertilizer";
import {getEmptyElements, getFillElementsByType} from "../../helpers";

const emptyElements = getEmptyElements()

const AquaMix = normalizeFertilizer(buildNPKFertilizer("Аквамикс", {
  Fe: 3.84,
  Mn: 2.57,
  Zn: 0.53,
  Cu: 0.53,
  Ca: 2.57,
  B: 0.52,
  Mo: 0.13
}))
const AK = normalizeFertilizer(buildNPKFertilizer("Акварин земляничный", {
  NO3: 7.9, NH4: 12.1, P: 5, K: 10, Mg: 1.5, S: 8.4,
  Fe: 0.054, Zn: 0.014, Cu: 0.001, Mn: .042, Mo: .004, B: 0.02,
}))

describe.skip("Calculate V2 Micro", () => {
  test("Simple calculation", () => {
    const result = calculate_v2({
        ...emptyElements,
        Fe: 4000 / 1000,
        Mn: 636 / 1000,
        B: 714 / 1000,
        Zn: 384 / 1000,
        Cu: 69 / 1000,
        Mo: 69 / 1000,
      },
      [AquaMix],
      {
        accuracy: 0.0001,
        ignore: {
          ...getFillElementsByType(true).macro,
        }
      }
    )
    expect(result).toEqual({
      "deltaElements": {
        ...emptyElements,
      },
      "elements": {
        ...emptyElements,
      },
      "fertilizers": [],
      "score": 98,
      "stats": {
        "count": 0,
        "time": 0
      }
    })
  })
  test("Калькуляция макро и получение микро остатков", () => {
    const result = calculate_v2({
        ...emptyElements,
        NO3: 200, NH4: 14, P: 50, K: 200, Ca: 170, Mg: 50, S: 0,
      },
      [AK],
      {
        accuracy: 0.001,
        ignore: {
          ...getFillElementsByType(true).micro,
          S: true
        }
      }
    )
    expect(result).toEqual({
      "deltaElements": {
        "B": -0.5,
        "Ca": 170,
        "Co": 0,
        "Cu": 0,
        "Fe": -1.1,
        "K": 11.4,
        "Mg": 29.5,
        "Mn": -0.9,
        "Mo": 0,
        "NH4": -275,
        "NO3": 20.5,
        "P": -0,
        "S": -190.9,
        "Si": 0,
        "Zn": -0.2
      },
      "elements": {
        "B": 0.45454545454545464,
        "Ca": 0,
        "Co": 0,
        "Cu": 0,
        "Fe": 1.1363636363636365,
        "K": 188.63636363636368,
        "Mg": 20.45454545454546,
        "Mn": 0.9090909090909093,
        "Mo": 0,
        "NH4": 275,
        "NO3": 179.54545454545456,
        "P": 50.00000000000001,
        "S": 190.90909090909093,
        "Si": 0,
        "Zn": 0.22727272727272732
      },
      "fertilizers": [
        {
          "base_weight": 2.273,
          "id": "Акварин земляничный",
          "weight": 2.273
        }
      ],
      "score": 0,
      "stats": {
        "count": 0,
        "time": 0
      }
    })
  })
})
