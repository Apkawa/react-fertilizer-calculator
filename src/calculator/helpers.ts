import {entries, round, sum} from "../utils";
import {FertilizerWeights} from './index';
import {Elements, MacroElements, MicroElements} from "./types";
import {calculateEC, calculateIonicBalance} from "./profile";
import {ElementsMatrixType, getProfileRatioMatrix} from "./ratio";

export interface NPKBalance {
  ion_balance: number,
  ratio: ElementsMatrixType,
  EC: number
}


export function getNPKDetailInfo(npk: Elements): NPKBalance {
  const ratio = getProfileRatioMatrix(npk)
  const result: NPKBalance = {
    ion_balance: calculateIonicBalance(npk),
    ratio,
    EC: calculateEC(npk),
  }
  result.EC = calculateEC(npk)

  entries(result).forEach(([k, v]) => {
    if (k === "ratio") {
      return
    }
    v = v as number
    if (!isFinite(v)) {
      v = 0
    }
    result[k] = round(v, 2)
  })

  return result
}

export function getFillElementsByType<T>(value: T): { macro: MacroElements<T>, micro: MicroElements<T> } {
  return {
    macro: {
      NO3: value, NH4: value, P: value, K: value, Ca: value, Mg: value, S: value, Cl: value,
    },
    micro: {
      Fe: value, Mn: value, B: value, Zn: value, Cu: value, Mo: value, Co: value, Si: value,
    }
  }

}

export function getEmptyElements(): Elements {
  const el = getFillElementsByType(0)
  return {
    ...el.micro,
    ...el.macro,
  }
}

// Считаем PPM раствора
export function calculatePPM(
  fertilizers: FertilizerWeights[],
  solution_volume = 1,
): number {
  return round(sum(fertilizers.map(f => {
    return f.weight * 1000
  })) / solution_volume)
}

// ppm (мг/л) в EC (мСм/см).  k - коэфициент преобразования
export function ppmToEC(ppm: number, k: number = 1.0): number {
  return round(ppm * (1 / k)) / 1000
}

export function ECToppm(EC: number, k: number): number {
  return round((EC * 1000) * k)
}


export interface CalculateToppingUpOptions {
  currentSolution: {
    EC: number,
    volume: number,
    profileEC: number,
    profileSaltsConcentration: number, // г/л
  }
  newSolution: {
    EC: number,
    volume: number,
  }
}

export interface CalculateToppingUpResult {
  concentration: number,
  weight: number,
  EC: number,
  volume: number,
}

// Расчет долива раствора
export function calculateToppingUp(options: CalculateToppingUpOptions): CalculateToppingUpResult {
  const cSol = options.currentSolution;
  const nSol = options.newSolution;

  const toppingVolume = nSol.volume - cSol.volume
  if (toppingVolume === 0) {
    return {
      weight: 0,
      concentration: 0,
      EC: 0,
      volume: 0
    }
  }

  const ECn = -(cSol.EC * cSol.volume - nSol.EC * cSol.volume - nSol.EC * toppingVolume) / toppingVolume
  const W2Ec = (cSol.profileSaltsConcentration / cSol.profileEC)

  const weight = round(ECn * W2Ec * toppingVolume, 3)
  const concentration = round((weight / 2) / toppingVolume, 2)
  return {
    weight,
    concentration,
    EC: round(ECn, 2),
    volume: toppingVolume
  }
}

/**
 *
 * @param value
 * @param percent 0.0 to 1.0
 */
export function extract_percent(value: number, percent: number): number {
  return value - (value / (1 + percent))

}
