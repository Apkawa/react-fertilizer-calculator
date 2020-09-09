import {buildNPKFertilizer, normalizeFertilizer} from "./fertilizer";


test("Build NPK Fertilizer", () => {
  const res = buildNPKFertilizer(
    "Valagro 3:11:38",
    {
      N: 3, P: 11, K: 38, Ca: 0, Mg: 4,
    })
  expect(res).toEqual({
    "composition": [
      {
        "formula": "N",
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

test("convert FertilizerInfo to element Fertilizer", () => {
  const res = normalizeFertilizer(buildNPKFertilizer(
    "Valagro 3:11:38",
    {
      N: 3, P: 11, K: 38, Ca: 0, Mg: 4,
    }))
  expect(res).toEqual({
      elements: {
        "Ca": 0,
        "K": 31.54,
        "Mg": 2.4,
        "N": 3,
        "P": 4.84,
      },
      "id": "Valagro 3:11:38",
    }
  )

})
