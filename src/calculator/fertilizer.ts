import {entries} from "../utils";
import {calculateMassParts, parseMolecule} from "./chem";

export interface Elements {
  N: number,
  P: number,
  K: number,
  Ca: number,
  Mg: number,
}

export interface Fertilizer extends Elements {
  id: string,
}

export interface FertilizerComposition {
  // As example:
  formula: string,
  // 0-100%
  percent?: number,
}

export interface FertilizerInfo {
  id: string,
  composition: FertilizerComposition[],
}

export type NPKElements = {
  [El in keyof Elements]?: Elements[El]
}

const NPKOxides = {
  N: 'N',
  P: 'P2O5',
  K: 'K2O',
  Ca: 'CaO',
  Mg: 'MgO',
}

export function buildNPKFertilizer(id: string, npk: NPKElements): FertilizerInfo {
    const composition: FertilizerComposition[] = entries(npk)
      .filter(([k,v]) => v > 0)
      .map(([k, v]) => {
        return {
          formula: NPKOxides[k],
          percent: v
        }
        }
      )
    return {
      id,
      composition
    }
}

export function normalizeFertilizer(fertilizerInfo: FertilizerInfo): Fertilizer {
  const el: Elements = { N: 0, P: 0, K: 0, Ca: 0, Mg: 0}

  for (let comp of fertilizerInfo.composition) {
    let massParts = calculateMassParts(parseMolecule(comp.formula))
    for (let [atom, mass] of entries(massParts)) {
      if (el.hasOwnProperty(atom)) {
        let percent = 100
        if (comp.percent) {
          percent = comp.percent;
        }
        el[atom] = percent * mass
      }
    }
  }
  return {
    id: fertilizerInfo.id,
    ...el
  }

}

