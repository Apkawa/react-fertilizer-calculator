import {entries, round, sum} from "../utils";
import {IONIC_STRENGTH} from "./constants";
import {FertilizerWeights} from "@/calculator/index";
import {Elements} from "@/calculator/types";

export interface NPKBalance {
  anions: number,
  cations: number,
  ion_balance: number,
  'N:K': number,
  'K:Ca': number,
  'Ca:Mg': number,
  '%NH4': number,
  EC: number
}


export function calculateNPKBalance(npk: Elements): NPKBalance {
  const result: NPKBalance = {
    anions: -0,
    cations: 0,
    ion_balance: 0,
    'N:K': (npk.NH4 + npk.NO3) / npk.K,
    'K:Ca': npk.K / npk.Ca,
    'Ca:Mg': npk.Ca / npk.Mg,
    '%NH4': round((npk.NH4 / (npk.NH4 + npk.NO3)) * 100, 1),
    EC: 0,
  }
  for (let [el, w] of entries(npk)) {
    const st = w * IONIC_STRENGTH?.[el]
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
    result[k] = round(v, 2)
  })

  return result
}


export function getEmptyElements(): Elements {
  return {NO3: 0, NH4: 0, P: 0, K: 0, Ca: 0, Mg: 0, S: 0}
}

// Считаем PPM раствора
export function calculatePPM(
  fertilizers: FertilizerWeights[],
  solution_volume: number = 1,
  solution_concentration: number = 100): number {
  return sum(fertilizers.map(f => {
    return (f.weight
      * solution_volume
      * (solution_concentration / 100)) * 1000
  })) / solution_volume
}

// ppm (мг/л) в EC (мСм/см).  k - коэфициент преобразования
export function ppmToEC(ppm: number, k: number=1.0): number {
  return round(ppm * (1 / k)) / 1000
}
