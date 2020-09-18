import {FertilizerInfo} from "./types";
import {normalizeFertilizer} from "./fertilizer";
import {round} from "../utils";

export interface Solution {
  id: string,
  volume: number,
  concentration: number,
  // TODO плотность
}

export type DilutionResult = Omit<Solution, "concentration">

export function dilution_solution(target: Solution, sources: Omit<Solution, "volume">[]): DilutionResult[] {
  const result: DilutionResult[] = []
  for (let s of sources) {
    result.push({
      id: s.id,
      volume: round((target.volume / s.concentration) * target.concentration, 2)
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
