import {calculateNPKBalance, calculateToppingUp, getEmptyElements, NPKBalance} from "../helpers";

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
      "ratio": {
        "Ca": {
          "Ca": 1, "Cl": 0, "K": 0.758, "Mg": 5.556, "N": 0.84, "NH4": 14.286, "NO3": 0.893, "P": 5.128, "S": 3.571
        },
        "Cl": {"Ca": 0, "Cl": 1, "K": 0, "Mg": 0, "N": 0, "NH4": 0, "NO3": 0, "P": 0, "S": 0},
        "K": {
          "Ca": 1.32, "Cl": 0, "K": 1, "Mg": 7.333, "N": 1.109, "NH4": 18.857, "NO3": 1.179, "P": 6.769, "S": 4.714
        },
        "Mg": {
          "Ca": 0.18, "Cl": 0, "K": 0.136, "Mg": 1, "N": 0.151, "NH4": 2.571, "NO3": 0.161, "P": 0.923, "S": 0.643
        },
        "N": {"Ca": 1.19, "Cl": 0, "K": 0.902, "Mg": 6.611, "N": 1, "NH4": 17, "NO3": 1.063, "P": 6.103, "S": 4.25},
        "NH4": {
          "Ca": 0.07, "Cl": 0, "K": 0.053, "Mg": 0.389, "N": 0.059, "NH4": 1, "NO3": 0.063, "P": 0.359, "S": 0.25
        },
        "NO3": {"Ca": 1.12, "Cl": 0, "K": 0.848, "Mg": 6.222, "N": 0.941, "NH4": 16, "NO3": 1, "P": 5.744, "S": 4},
        "P": {
          "Ca": 0.195, "Cl": 0, "K": 0.148, "Mg": 1.083, "N": 0.164, "NH4": 2.786, "NO3": 0.174, "P": 1, "S": 0.696
        },
        "S": {"Ca": 0.28, "Cl": 0, "K": 0.212, "Mg": 1.556, "N": 0.235, "NH4": 4, "NO3": 0.25, "P": 1.436, "S": 1}
      }
    }
    expect(result).toEqual(e)
  })
})


describe('calculateToppingUp', () => {
  test('Generic', () => {
    let result = calculateToppingUp({
      newSolution: {
        volume: 25,
        EC: 1.95,
      },
      currentSolution: {
        volume: 20,
        EC: 0.6,
        profileEC: 0.75,
        profileSaltsConcentration: 0.68
      }
    })
    expect(result).toEqual({
      "EC": 7.35,
      "concentration": 3.33,
      "weight": 33.32,
      "volume": 5,
    })

  })
})
