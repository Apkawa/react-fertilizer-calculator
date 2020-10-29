import {buildNPKFertilizer, normalizeFertilizer} from "../fertilizer";
import {getEmptyElements} from "../helpers";


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
          "K": 31.54,
          "Mg": 2.4,
          "NO3": 3,
          "NH4": 0,
          "P": 4.84,
          S: 0,
        },
        "id": "Valagro 3:11:38",
      }
    )
  })

  test("convert FertilizerInfo.npk to element Fertilizer", () => {
    const res = normalizeFertilizer({id: "Valagro 3:11:38",
        npk: {NO3: 3, P: 11, K: 38, Ca: 0, Mg: 4,}}
        )
    expect(res).toEqual({
        elements: {
          ...getEmptyElements(),
          "Ca": 0,
          "K": 31.54,
          "Mg": 2.4,
          "NO3": 3,
          "NH4": 0,
          "P": 4.84,
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
        K: 39,
        NO3: 14,
        S: 0,
      }
    })
  })
  test('raw NPK сульфат магния', () => {
    const result = normalizeFertilizer(buildNPKFertilizer("сульфат магния", {Mg: 16.7, S: 13.5})
    , true)
    expect(result).toMatchObject({
      elements: {
        Mg: 10.02,
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
        K: 39,
        NO3: 14
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
        K: 46.8,
        NO3: 14
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
      Mg: 9.8,
      S: 12.74,
    })
  })
})
