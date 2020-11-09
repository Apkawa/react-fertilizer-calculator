import {calculate_v2} from "../../index";
import {getEmptyElements, getFillElementsByType} from "../../helpers";
import {FertilizerInfo} from "../../types";

const emptyElements = getEmptyElements()

const AK: FertilizerInfo = {
  id: "Акварин земляничный", npk: {
    NO3: 7.9, NH4: 12.1, P: 5, K: 10, Mg: 1.5, S: 8.4,
    Fe: 0.054, Zn: 0.014, Cu: 0.001, Mn: .042, Mo: .004, B: 0.02,
  }
}

const AquaMix: FertilizerInfo = {
  id: "Аквамикс",
  npk: {Fe: 3.84, Mn: 2.57, Zn: 0.53, Cu: 0.53, Ca: 2.57, B: 0.52, Mo: 0.13},
  solution_concentration: 5.75
}

describe("Calculate V2 Micro", () => {
  test("Simple calculation", () => {
    const result = calculate_v2({
        Fe: 4000 / 1000,
        Mn: 636 / 1000,
        B: 714 / 1000,
        Zn: 384 / 1000,
        Cu: 69 / 1000,
        Mo: 69 / 1000,
      },
      [AquaMix],
      {
        solution_concentration: 1,
        solution_volume: 1,
        accuracy: 0.001,
        ignore: {
          ...getFillElementsByType(true).macro,
        }
      }
    )
    expect(result).toEqual({
      "deltaElements": {
        "B": 0,
        "Ca": -2,
        "Co": 0,
        "Cu": -0.7,
        "Fe": -1.3,
        "K": 0,
        "Mg": 0,
        "Mn": -2.9,
        "Mo": -0.1,
        "NH4": 0,
        "NO3": 0,
        "P": 0,
        "S": 0,
        "Si": 0,
        "Zn": -0.3
      },
      "elements": {
        "B": 0.714,
        "Ca": 2,
        "Co": 0,
        "Cu": 0.7277,
        "Fe": 5.2726,
        "K": 0,
        "Mg": 0,
        "Mn": 3.5288,
        "Mo": 0.1785,
        "NH4": 0,
        "NO3": 0,
        "P": 0,
        "S": 0,
        "Si": 0,
        "Zn": 0.7277
      },
      "fertilizers": [{"base_weight": 0.137, "id": "Аквамикс", "volume": 23.826, "weight": 0.137}],
      "score": 26,
      "stats": {"count": 0, "time": 0}
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
        "B": 0,
        "Ca": 170,
        "Co": 0,
        "Cu": 0,
        "Fe": -0.1,
        "K": 190,
        "Mg": 49,
        "Mn": 0,
        "Mo": 0,
        "NH4": 0,
        "NO3": 191,
        "P": 47,
        "S": -10,
        "Si": 0,
        "Zn": 0
      },
      "elements": {
        "B": 0.0231,
        "Ca": 0,
        "Co": 0,
        "Cu": 0,
        "Fe": 0.0579,
        "K": 10,
        "Mg": 1,
        "Mn": 0.0463,
        "Mo": 0,
        "NH4": 14,
        "NO3": 9,
        "P": 3,
        "S": 10,
        "Si": 0,
        "Zn": 0.0116
      },
      "fertilizers": [{"base_weight": 0.116, "id": "Акварин земляничный", "volume": null, "weight": 0.116}],
      "score": 3,
      "stats": {"count": 0, "time": 0}
    })
  })
})
