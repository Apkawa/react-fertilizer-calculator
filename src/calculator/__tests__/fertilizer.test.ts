import {buildFertilizerFromSolution, buildNPKFertilizer, normalizeFertilizer} from "../fertilizer";
import {getEmptyElements} from "../helpers";
import {calculate_v2} from "../index";


test("Build NPK Fertilizer", () => {
  const res = buildNPKFertilizer(
    "Valagro 3:11:38",
    {
      NO3: 3, P: 11, K: 38, Ca: 0, Mg: 4,
    })
  expect(res).toEqual({
    "composition": [
      {
        "formula": "NO3",
        "percent": 3
      },
      {
        "formula": "P2O5",
        "percent": 11
      },
      {
        "formula": "K2O",
        "percent": 38
      },
      {
        "formula": "MgO",
        "percent": 4
      }
    ],
    "id": "Valagro 3:11:38"
  })

})

describe("normalizeFertilizer", () => {
  test("convert FertilizerInfo to element Fertilizer", () => {
    const res = normalizeFertilizer(buildNPKFertilizer(
      "Valagro 3:11:38",
      {
        NO3: 3, P: 11, K: 38, Ca: 0, Mg: 4,
      }))
    expect(res).toEqual({
        elements: {
          ...getEmptyElements(),
          "Ca": 0,
          "K": 31.55,
          "Mg": 2.41,
          "NO3": 3,
          "NH4": 0,
          "P": 4.8,
          S: 0,
        },
        "id": "Valagro 3:11:38",
      }
    )
  })

  test("convert FertilizerInfo.npk to element Fertilizer", () => {
    const res = normalizeFertilizer({
        id: "Valagro 3:11:38",
        npk: {NO3: 3, P: 11, K: 38, Ca: 0, Mg: 4,}
      }
    )
    expect(res).toEqual({
        elements: {
          ...getEmptyElements(),
          "Ca": 0,
          "K": 31.55,
          "Mg": 2.41,
          "NO3": 3,
          "NH4": 0,
          "P": 4.8,
          S: 0,
        },
        "id": "Valagro 3:11:38",
      }
    )
  })


  test('Fertilizer formula to raw NPK', () => {
    const result = normalizeFertilizer({
      id: "Нитрат калия",
      composition: [
        {formula: "KNO3"}
      ]
    }, true)
    expect(result).toMatchObject({
      elements: {
        K: 38.67,
        NO3: 13.85,
        S: 0,
      }
    })
  })
  test('raw NPK сульфат магния', () => {
    const result = normalizeFertilizer(buildNPKFertilizer("сульфат магния", {Mg: 16.7, S: 13.5})
      , true)
    expect(result).toMatchObject({
      elements: {
        Mg: 10.07,
        S: 13.5,
      }
    })
  })

  test('Fertilizer complex formula to raw NPK', () => {
    const result = normalizeFertilizer({
      id: "Нитрат калия",
      composition: [
        {formula: "KNO3", percent: 35},
        {formula: "KNO3", percent: 100 - 35}
      ]
    }, true)
    expect(result).toMatchObject({
      elements: {
        K: 38.68,
        NO3: 13.86
      }
    })
  })


  test('Fertilizer formula to oxide NPK', () => {
    const result = normalizeFertilizer({
      id: "Нитрат калия",
      composition: [
        {formula: "KNO3"}
      ]
    }, false)
    expect(result).toMatchObject({
      elements: {
        K: 46.4,
        NO3: 13.85
      }
    })
  })
  test('Нитрат аммония  to NPK', () => {
    const result = normalizeFertilizer({
      id: "Нитрат аммония",
      composition: [
        {formula: "NH4NO3", percent: 98}
      ]
    }, false)
    expect(result.elements).toMatchObject({
      NO3: 17.15,
      NH4: 17.15,
    })
  })
  test('Сульфат магния  to raw NPK', () => {
    const result = normalizeFertilizer({
      id: "Нитрат аммония",
      composition: [
        {formula: "MgSO4*7H2O", percent: 98}
      ]
    }, true)
    expect(result.elements).toMatchObject({
      Mg: 9.66,
      S: 12.75,
    })
  })

  test("Сохранение комплексного удобрения buildFertilizerFromSolution", () => {
    const fertilizers = [
      {"id": "Хелат Fe", "npk": {"Fe": 11},},
      {"id": "Хелат Mn", "npk": {"Mn": 13},},
      {"id": "Хелат Cu", "npk": {"Cu": 15}},
      {"id": "Хелат Zn", "npk": {"Zn": 15},},
      {"id": "Метаборат калия", "npk": {"B": 10.1, "K": 44},},
    ]
    const solution_volume = 0.5
    const result = calculate_v2({
        Fe: 4000 / 1000,
        Mn: 600 / 1000,
        B: 600 / 1000,
        Zn: 600 / 1000,
        Cu: 50 / 1000,
        Mo: 50 / 1000,
      },
      fertilizers,
      {
        solution_volume,
        solution_concentration: 1000,
        accuracy: 0.001,
        ignore: {
          S: true
        }
      }
    )
    expect(result).toMatchObject({deltaElements: {B: 0}})

    const complexFertilizer = buildFertilizerFromSolution("Micro", {
      fertilizers,
      fertilizer_weights: result.fertilizers,
      volume: solution_volume
    })
    expect(complexFertilizer).toEqual({
      "id": "Micro",
      "npk": {"B": 1.17, "Cu": 0.1, "Fe": 7.8, "K": 5.08, "Mn": 1.17, "Zn": 1.17},
      "solution_concentration": 51.254
    })

    const result2 = calculate_v2({
        Fe: 4000 / 1000,
        Mn: 600 / 1000,
        B: 600 / 1000,
        Zn: 600 / 1000,
        Cu: 50 / 1000,
        Mo: 50 / 1000,
      },
      [complexFertilizer],
      {
        solution_volume: 10,
        solution_concentration: 1,
        accuracy: 0.001,
        ignore: {
          S: true
        }
      }
    )

    expect(result2).toMatchObject({deltaElements: {B: 0}})
    expect(result2.fertilizers[0]).toMatchObject({volume: 10.009})

  })
})
