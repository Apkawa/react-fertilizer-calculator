import {entries, round, sum} from "../utils";
import {IONIC_STRENGTH} from "./constants";
import {FertilizerWeights} from './index';
import {Elements, MacroElements, MicroElements} from "./types";
import {ElementsMatrixType, getProfileRatioMatrix} from "./profile";

export interface NPKBalance {
  anions: number,
  cations: number,
  ion_balance: number,
  ratio: ElementsMatrixType,
  EC: number
}


export function calculateNPKBalance(npk: Elements): NPKBalance {
  const ratio = getProfileRatioMatrix(npk)
  const result: NPKBalance = {
    anions: -0,
    cations: 0,
    ion_balance: 0,
    ratio,
    EC: 0,
  }
  for (let [el, w] of entries(npk)) {
    let ionS = 0
    if (el in IONIC_STRENGTH) {
      // TODO починить тип
      ionS = (IONIC_STRENGTH as any)[el] || 0
    }
    const st = w * ionS
    if (Math.sign(st) < 0) {
      result.anions += st
    } else {
      result.cations += st
    }
    result.ion_balance += st
  }
  // TODO понять что за магические числа
  result.EC = 0.095 * result.cations + 0.19

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
