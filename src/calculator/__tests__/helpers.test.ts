import {calculateNPKBalance, getEmptyElements, NPKBalance} from "../helpers";

describe('calculateNPKBalance', () => {
  test('Check', () => {
    const result = calculateNPKBalance({
      ...getEmptyElements(),
      NO3: 224,
      NH4: 14,
      P: 39,
      K: 264,
      Ca: 200,
      Mg: 36,
      S: 56,
    })
    const e: NPKBalance = {
      // 20,69	-20,74	-0,050	2,16	5,9%	0,90	1,32	5,56
      cations: 20.69,
      anions: -20.74,
      ion_balance: -0.050,
      EC: 2.16,
      "%NH4": 6.3,
      "ratio": {
        "Ca": {"Ca": 1, "K": 0.758, "Mg": 5.556, "N": 0.84, "P": 5.128, "S": 3.571},
        "K": {"Ca": 1.32, "K": 1, "Mg": 7.333, "N": 1.109, "P": 6.769, "S": 4.714},
        "Mg": {"Ca": 0.18, "K": 0.136, "Mg": 1, "N": 0.151, "P": 0.923, "S": 0.643},
        "N": {"Ca": 1.19, "K": 0.902, "Mg": 6.611, "N": 1, "P": 6.103, "S": 4.25},
        "P": {"Ca": 0.195, "K": 0.148, "Mg": 1.083, "N": 0.164, "P": 1, "S": 0.696},
        "S": {"Ca": 0.28, "K": 0.212, "Mg": 1.556, "N": 0.235, "P": 1.436, "S": 1}
      }
    }
    expect(result).toEqual(e)
  })
})
