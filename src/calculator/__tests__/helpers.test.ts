import {calculateNPKBalance, getEmptyElements, NPKBalance} from "../helpers";

describe('calculateNPKBalance',() => {
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
      "%NH4": 5.9,
      "N:K":0.90,
      "K:Ca": 1.32,
      "K:Mg": 7.33
    }
    expect(result).toEqual(e)
  })
})
