import {DATA_KEYS} from "./constants";
import {getConcentrationFromDensity, getDensityFromConcentration} from "./index";
import {entries} from "../../utils";

describe("getConcentrationFromDensity", () => {
  test('Generic', () => {
    const expectData = {
      "NH4NO3": 1.0383,
      "Ca(NO3)2": 1.0711,
      "MgSO4": 1.0933,
      "Mg(NO3)2": 1.0704,
      "KNO3": 1.0589,
      "K2SO4": 1.0753,
      "KH2PO4": 1.0656,
      "Ca(NO3)2*4H2O": 1.0493,
      "MgSO4*7H2O": 1.0457,
      "Mg(NO3)2*6H2O": 1.0402
    }
    for (let [k, v] of entries(expectData)) {
      expect(getConcentrationFromDensity(k, v)).toBeCloseTo(100)
    }
  })
})

describe("getDensityFromConcentration", () => {
  test('Generic', () => {
    const expectData = {
      "NH4NO3": 1.0383,
      "Ca(NO3)2": 1.0711,
      "MgSO4": 1.0933,
      "Mg(NO3)2": 1.0704,
      "KNO3": 1.0589,
      "K2SO4": 1.0753,
      "KH2PO4": 1.0656,
      "Ca(NO3)2*4H2O": 1.0493,
      "MgSO4*7H2O": 1.0457,
      "Mg(NO3)2*6H2O": 1.0402
    }
    for (let key of DATA_KEYS) {
      expect(getDensityFromConcentration(key, 100)).toBeCloseTo(expectData[key])
    }
  })
  test("Interpolate for Ca(NO3)2*4H2O", () => {
    expect(getDensityFromConcentration("Ca(NO3)2*4H2O", 850)).toBeCloseTo(1.3914)
  })
  test.skip("Interpolate for NH4NO3", () => {
    // TODO проверить реальную растворимость, имеет ли смысл вообще интерполировать до максимальных растворимостей?
    expect(getDensityFromConcentration("NH4NO3", 1200)).toBeCloseTo(1.4469)
  })

  test("Check limits", () => {
    expect(getDensityFromConcentration("Ca(NO3)2*4H2O", 950)).toEqual(NaN)
  })
})
