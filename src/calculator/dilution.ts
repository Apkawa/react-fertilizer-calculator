import {FertilizerInfo} from "./types";
import {normalizeFertilizer} from "./fertilizer";
import {round} from "../utils";

export interface Concentration {
  // Коэфициент разбавления. C1 = V2/V1
  k: number,
  // запись концентрата в Nмл на Mл
  // Объем концентрата, в мл
  v_1: number,
  // Объем целевого раствора, в мл. По умолчанию 1000мл.
  v_2: number,
}

export interface Solution {
  id: string,
  // Объем в литрах
  volume: number,
  // в 1/100%
  concentration: Concentration | number,
  // TODO плотность
}

export type DilutionResult = Omit<Solution, "concentration">

/**
 * Разбавление раствора
 * @param target type `Solution` - целевой раствор
 * @param sources Solution[] - концентраты
 * @return DilutionResult[] - сколько нужно взять концентрата чтобы получить итоговый раствор
 */
export function dilution_solution(target: Solution, sources: Omit<Solution, "volume">[]): DilutionResult[] {
  const t_con = normalizeConcentration(target.concentration)
  const result: DilutionResult[] = []
  for (let s of sources) {
    const s_con = normalizeConcentration(s.concentration)
    result.push({
      id: s.id,
      volume: round((target.volume / s_con.k) * t_con.k, 4)
    })
  }
  return result
}


type FertilizerGroupBySolution = { [K in "A" | "B" | "C"]?: FertilizerInfo[] }

// Делим удобрения на несколько растворов
// Бутылка-1 Макра-азотная
// Селитра амиачная
// Селитра калиевая
// Селитра кальциевая
//
// Бутылка 2 Макра-серно-фосфорная
// Сульфат аммония
// Сульфат магния семиводный
// Монофосфат калия
/**
 * разделение удобрений на группы А, В и С
 * Смысл в том что удобрения могут прореагировать в растворе и выпасть в нерастворимый осадок, особенно в концентратах
 * В группу А попадают вся селитра NO3
 * В группу В попадают сульфаты и фосфаты
 * В группу С все остальное
 * @param fertilizers type FertilizerInfo[]
 */
export function groupFertilizerBySolution(fertilizers: FertilizerInfo[]): FertilizerGroupBySolution {
  const groups: FertilizerGroupBySolution = {}
  for (let f of fertilizers) {
    let nf = normalizeFertilizer(f)
    if (nf.elements.NO3) {
      groups.A = [...groups.A || [], f]
      continue
    }
    if (nf.elements.S || nf.elements.P) {
      groups.B = [...groups.B || [], f]
      continue
    }
    groups.C = [...groups.C || [], f]

  }
  return groups
}



export function normalizeConcentration(concentration: Partial<Concentration> | number): Required<Concentration> {
  if (typeof concentration == 'number') {
    return {
      k: concentration,
      v_1: round(1000 / concentration, 2),
      v_2: 1000,
    }
  }
  if (concentration.v_1) {
    return {
      k: round((concentration.v_2 || 1000) / concentration.v_1, 2),
      v_2: concentration.v_2 || 1000,
      v_1: concentration.v_1
    }
  }
  else if (concentration.k) {
    return {
      k: concentration.k,
      v_2: 1000,
      v_1: round(1000 / concentration.k, 2)
    }
  }
  throw Error("Invalid concentration")
}