import {convertProfileWithEC, getProfileRatioMatrix} from "../profile";

describe("Calculate profile matrix", () => {
  test("Generic", () => {
    const npk = { NO3: 200, NH4: 20, P: 40, K: 180, Ca: 200, Mg: 50, S: 73, }
    const result = getProfileRatioMatrix(npk)
    expect(result).toEqual({
      "Ca": { "Ca": 1, "K": 1.111, "Mg": 4, "N": 0.909, "P": 5, "S": 2.74 },
      "K": { "Ca": 0.9, "K": 1, "Mg": 3.6, "N": 0.818, "P": 4.5, "S": 2.466 },
      "Mg": { "Ca": 0.25, "K": 0.278, "Mg": 1, "N": 0.227, "P": 1.25, "S": 0.685 },
      "N": { "Ca": 1.1, "K": 1.222, "Mg": 4.4, "N": 1, "P": 5.5, "S": 3.014 },
      "P": { "Ca": 0.2, "K": 0.222, "Mg": 0.8, "N": 0.182, "P": 1, "S": 0.548 },
      "S": { "Ca": 0.365, "K": 0.406, "Mg": 1.46, "N": 0.332, "P": 1.825, "S": 1 }
    })
  })
})



describe("Convert profile with EC", () => {
  test("Generic", () => {
    const npk = {NO3: 200, NH4: 20, P: 40, K: 180, Ca: 200, Mg: 50, S: 73, }
    const result = convertProfileWithEC(npk, 1.5)
    expect(result).toEqual({
      "Ca": 138,
      "K": 124,
      "Mg": 34,
      "NH4": 13,
      "NO3": 139,
      "P": 40,
      "S": 73
    })
  })
})
