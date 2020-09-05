import {entries, round, sum, values} from "../utils";
import {ATOMIC_MASS, AtomNameType} from "./constants";

type DecomposedChemFormula = {
  [Atom in AtomNameType]?:  number ;
}



interface ChemicalFormula {
  (formula: string): DecomposedChemFormula
}

const decomposeFormula: ChemicalFormula = require('./molecular-parser/molecularParser').decomposeFormula;

/**
 *
 * @param formula
 * @return
 */
export function parseMolecule(formula: string): DecomposedChemFormula {
  return decomposeFormula(formula)
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

