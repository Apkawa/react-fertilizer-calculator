import {entries, round, sum} from "../utils";
import {IONIC_STRENGTH} from "./constants";
import {FertilizerWeights} from "@/calculator/index";
import {Elements, MacroElements, MicroElements} from "@/calculator/types";

export interface NPKBalance {
  anions: number,
  cations: number,
  ion_balance: number,
  'N:K': number,
  'K:Ca': number,
  'K:Mg': number,
  '%NH4': number,
  EC: number
}


export function calculateNPKBalance(npk: Elements): NPKBalance {
  const result: NPKBalance = {
    anions: -0,
    cations: 0,
    ion_balance: 0,
    // TODO build matrix
    'N:K': (npk.NH4 + npk.NO3) / npk.K,
    'K:Ca': npk.K / npk.Ca,
    'K:Mg': npk.K / npk.Mg,
    '%NH4': round((npk.NH4 / (npk.NH4 + npk.NO3)) * 100, 1),
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
    if (!isFinite(v)) {
      v = 0
    }
    result[k] = round(v, 2)
  })

  return result
}

export function getFillElementsByType<T>(value:T) : {macro: MacroElements<T>, micro: MicroElements<T>} {
  return {
    macro: {
      NO3: value, NH4: value, P: value, K: value, Ca: value, Mg: value, S: value,
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
  solution_volume=1,
): number {
  return round(sum(fertilizers.map(f => {
    return f.weight * 1000
  })) / solution_volume)
}

// ppm (мг/л) в EC (мСм/см).  k - коэфициент преобразования
export function ppmToEC(ppm: number, k: number=1.0): number {
  return round(ppm * (1 / k)) / 1000
}
