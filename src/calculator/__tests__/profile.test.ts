import {
  calculateEC,
  calculateIonicBalance,
  convertProfileWithEC,
  fixIonicBalanceByCa, fixIonicBalanceByS
} from "../profile";
import {round} from "../../utils";
import {convertProfileWithRatio, getProfileRatioMatrix} from "../ratio";

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

test("calculate EC", () => {
  const npk = {
    NO3: 220,
    NH4: 20,
    P: 40,
    K: 280,
    Ca: 140,
    Mg: 56,
    S: 50.471,
    Cl: 0,
  }
  let EC = calculateEC(npk)
  expect(EC).toEqual(2.107)
})

describe("Ionic balance", () => {
  const npk = {
    NO3: 220,
    NH4: 20,
    P: 40,
    K: 280,
    Ca: 140,
    Mg: 56,
    S: 51.077,
    Cl: 0,
  }
  test("calculate", () => {
    let I = calculateIonicBalance(npk)
    expect(I).toEqual(0)
  })
  test("fix by S", () => {
    let mS = fixIonicBalanceByS(npk)
    expect(mS).toEqual(npk.S)
  })
  test("fix by Ca", () => {
    let mCa = fixIonicBalanceByCa(npk)
    expect(mCa).toEqual(npk.Ca)
  })

})


describe("Convert profile with EC", () => {
  const npk = {NO3: 200, NH4: 20, P: 40, K: 180, Ca: 200, Mg: 50, S: 73,}
  test("Generic", () => {
    const EC = calculateEC(npk);
    const result = convertProfileWithEC(npk, round(EC, 3))
    const ratio = getProfileRatioMatrix(result)
    expect(round(ratio.NH4.NO3, 1)).toEqual(0.1)
    expect(result).toEqual(npk)
  })
  test("to EC=1.5", () => {
    const npk = {NO3: 200, NH4: 20, P: 40, K: 180, Ca: 200, Mg: 50, S: 72.44,}
    const result = convertProfileWithEC(npk, 1.5)
    const ratio = getProfileRatioMatrix(result)
    expect(round(ratio.NH4.NO3, 1)).toEqual(0.1)
    expect(result).toEqual({"Ca": 137, "K": 123.3, "Mg": 34.3, "NH4": 13.7, "NO3": 137.1, "P": 40, "S": 43.5})
  })
})

describe("get profile ratio", () => {
  test("P.K == P / K", () => {
    const npk = {NO3: 200, NH4: 20, P: 40, K: 180, Ca: 200, Mg: 50, S: 73}
    const ratio = getProfileRatioMatrix(npk)
    // Пров
    expect(round(ratio.P.K, 1)).toEqual(round(npk.P / npk.K, 1))
    expect(round(ratio.K.P, 1)).toEqual(round(npk.K / npk.P, 1))
    expect(round(ratio.K.K, 1)).toEqual(1)
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
  })
  test("Keep KN, KCa, KMg ratio", () => {
    const npk = {NO3: 200, NH4: 20, P: 40, K: 180, Ca: 200, Mg: 50, S: 73,}
    const oldRatio = getProfileRatioMatrix(npk)
    expect(round(oldRatio.K.Ca, 1)).toEqual(0.9)
    let result = convertProfileWithRatio(npk, {K: {N: 1.5}})
    const ratio = getProfileRatioMatrix(result)
    expect(round(ratio.K.N, 1)).toEqual(1.5)
    expect(round(ratio.K.Ca, 1)).toEqual(0.9)
  })
})
