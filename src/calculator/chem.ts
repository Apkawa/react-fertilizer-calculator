import {entries, round, sum, values} from "../utils";
import {ATOMIC_MASS, AtomNameType} from "./constants";
import {decomposeFormula, findSubgroups} from './molecular-parser/molecularParser';

export type DecomposedChemFormula = {
  [Atom in AtomNameType]?: number;
}

type ParsedNitrateType = {
  NH4: number,
  NO3: number
}

/**
 *
 * @param formula
 * @return
 */
export function parseMolecule(formula: string): DecomposedChemFormula {
  return decomposeFormula(formula)
}

export function parseNitrates(formula: string): ParsedNitrateType {
  const nitrates: ParsedNitrateType = {"NH4": 0, "NO3": 0}
  const re = /NH4|NO3|NH2/g
  for (let s of findSubgroups(formula)) {
    let subFormula = s.formula
    if (subFormula === 'NH2') {
      subFormula = 'NH4'
    }
    if (nitrates.hasOwnProperty(subFormula)) {
      nitrates[subFormula as keyof typeof nitrates] += s.count
      continue
    }
    if (subFormula !== formula) {
      for (let [n, c] of entries(parseNitrates(subFormula))) {
        (nitrates as ParsedNitrateType)[n] += c
      }
    } else {
      for (let r of subFormula.matchAll(re)) {
        let nType = r[0];
        // Для мочевины, она соответствует аммонийному азоту
        if (nType === 'NH2') {
          nType = 'NH4'
        }
        (nitrates as ParsedNitrateType)[nType as keyof ParsedNitrateType] += s.count
      }
    }
  }
  return nitrates
}

export function calculateMassParts(formula: DecomposedChemFormula): DecomposedChemFormula {
  const atomMasses = Object.fromEntries(entries(formula).map(
    ([atom, count]) =>
      [atom, ATOMIC_MASS[atom] * count]
    )
  ) as DecomposedChemFormula

  const totalMass = sum(values(atomMasses))
  return Object.fromEntries(
    entries(atomMasses).map(([atom, mass]) => [atom, round(mass / totalMass, 2)])
  ) as DecomposedChemFormula
}

