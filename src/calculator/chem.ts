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
  const re = /NH4|NO3/g
  for (let s of findSubgroups(formula)) {

    if (nitrates.hasOwnProperty(s.formula)) {
      nitrates[s.formula as keyof typeof nitrates] += s.count
      continue
    }
    if (s.formula !== formula) {
      for (let [n, c] of entries(parseNitrates(s.formula))) {
        (nitrates as ParsedNitrateType)[n] += c
      }
    } else {
      for (let r of s.formula.matchAll(re)) {
        (nitrates as ParsedNitrateType)[r[0] as keyof ParsedNitrateType] += s.count
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

