import {convertProfileWithEC, convertProfileWithRatio, getProfileRatioMatrix} from "../profile";
import {round} from "../../utils";

describe("Calculate profile matrix", () => {
  test("Generic", () => {
    const npk = {NO3: 200, NH4: 20, P: 40, K: 180, Ca: 200, Mg: 50, S: 73,}
    const result = getProfileRatioMatrix(npk)
    expect(result).toEqual({
        "Ca": {"Ca": 1, "K": 1.111, "Mg": 4, "N": 0.909, "NH4": 10, "NO3": 1, "P": 5, "S": 2.74},
        "K": {"Ca": 0.9, "K": 1, "Mg": 3.6, "N": 0.818, "NH4": 9, "NO3": 0.9, "P": 4.5, "S": 2.466},
        "Mg": {"Ca": 0.25, "K": 0.278, "Mg": 1, "N": 0.227, "NH4": 2.5, "NO3": 0.25, "P": 1.25, "S": 0.685},
        "N": {"Ca": 1.1, "K": 1.222, "Mg": 4.4, "N": 1, "NH4": 11, "NO3": 1.1, "P": 5.5, "S": 3.014},
        "NH4": {"Ca": 0.1, "K": 0.111, "Mg": 0.4, "N": 0.091, "NH4": 1, "NO3": 0.1, "P": 0.5, "S": 0.274},
        "NO3": {"Ca": 1, "K": 1.111, "Mg": 4, "N": 0.909, "NH4": 10, "NO3": 1, "P": 5, "S": 2.74},
        "P": {"Ca": 0.2, "K": 0.222, "Mg": 0.8, "N": 0.182, "NH4": 2, "NO3": 0.2, "P": 1, "S": 0.548},
        "S": {"Ca": 0.365, "K": 0.406, "Mg": 1.46, "N": 0.332, "NH4": 3.65, "NO3": 0.365, "P": 1.825, "S": 1}
      }
    )
  })
})

describe("Convert profile with EC", () => {
  test("Generic", () => {
    const npk = {NO3: 200, NH4: 20, P: 40, K: 180, Ca: 200, Mg: 50, S: 73,}
    const result = convertProfileWithEC(npk, 1.5)
    const ratio = getProfileRatioMatrix(result)
    expect(round(ratio.NH4.NO3, 1)).toEqual(0.1)
    expect(result).toEqual({ "Ca": 137.8, "K": 124.1, "Mg": 34.5, "NH4": 13.8, "NO3": 137.9, "P": 40, "S": 73 })

  })
})

describe("Convert profile with ratio", () => {
  test("Generic", () => {
    const npk = {NO3: 200, NH4: 20, P: 40, K: 180, Ca: 200, Mg: 50, S: 73,}
    const result = convertProfileWithRatio(npk, {N: {P: 5.5}})
    expect(result).toEqual(npk)
  })
  test("Check keep NH4 ratio", () => {
    const npk = {NO3: 200, NH4: 20, P: 40, K: 180, Ca: 200, Mg: 50, S: 73,}
    const result = convertProfileWithRatio(npk, {N: {P: 4}})
    const ratio = getProfileRatioMatrix(result)
    expect(round(ratio.NH4.NO3, 1)).toEqual(0.1)
    expect(result.NO3).toEqual(((npk.P * 4) - 15) + 0.5)
    expect(result.NH4).toEqual(14.5)
  })
})
