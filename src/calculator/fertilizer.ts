import {entries, keys, round, sum, values} from "../utils";
import {calculateMassParts, parseMolecule, parseNitrates} from "./chem";
import {AtomNameType} from "./constants";
import {getEmptyElements} from "./helpers";
import {Elements, Fertilizer, FertilizerComposition, FertilizerInfo, NPKElements} from "@/calculator/types";

const NPKOxides = {
  NO3: 'NO3',
  NH4: 'NH4',
  P: 'P2O5',
  K: 'K2O',
  Ca: 'CaO',
  Mg: 'MgO',
}

export function buildNPKFertilizer(id: string, npk: NPKElements): FertilizerInfo {
  const composition: FertilizerComposition[] = entries(npk)
    .filter(v => v[1] > 0)
    .map(([k, v]) => {
        let oxide: string = k
        if (NPKOxides.hasOwnProperty(k)) {
          oxide = NPKOxides[k] as string
        }
        return {
          formula: oxide,
          percent: v
        }
      }
    )
  return {
    id,
    composition
  }
}

export function compositionToNPKElements(composition: FertilizerComposition[]): Elements {
  const elements: Elements = getEmptyElements()
  for (let comp of composition) {
    let atomCounts = parseMolecule(comp.formula)
    let massParts = calculateMassParts(atomCounts)
    for (let [atom, mass] of entries(massParts)) {
      let subAtoms = {[atom]: 1}
      if (atom === "N") {
        subAtoms = parseNitrates(comp.formula)
        if (keys(elements).includes(comp.formula as keyof Elements)) {
          mass = 1
        }
      }
      const totalSubAtoms = sum(values(subAtoms))
      for (let [a, k] of entries(subAtoms)) {
        if (elements.hasOwnProperty(a)) {
          let percent = 100
          if (comp.percent) {
            percent = comp.percent;
          }
          percent *= (k / totalSubAtoms)
          elements[a as keyof Elements] += round(percent * mass, 2)
        }
      }
    }
  }
  return elements
}

/**
 * Конвертация чистых элементов в NPK оксиды
 * @param {Elements} elements - чистые элементы
 */
export function elementsToNPK(elements: NPKElements): Elements {
  const e = entries(elements).map(([atom, val]) => {
    const oxide: string = (NPKOxides as any)[atom] || atom
    const massParts = calculateMassParts(parseMolecule(oxide))
    const skipElements = massParts.hasOwnProperty("N") || massParts.hasOwnProperty("S")
    const elementMassPart = massParts[atom as AtomNameType]
    if (!skipElements && elementMassPart) {
      const k = round(sum(values(massParts)) / elementMassPart, 2)
      val = round(val * k, 2)
    }
    return [atom, val]
  })
  return Object.fromEntries(e)
}

/**
 * Расчет состава удобрения в чистые элементы
 * @param {FertilizerInfo} fertilizerInfo
 * @param convertMass - преобразовать ли в чистые элементы
 * @return {Fertilizer}
 */
export function normalizeFertilizer(fertilizerInfo: FertilizerInfo, convertMass = true): Fertilizer {
  let elements: Elements = getEmptyElements()
  let composition = fertilizerInfo.composition;
  if (fertilizerInfo.npk) {
    composition = buildNPKFertilizer(fertilizerInfo.id, fertilizerInfo.npk).composition
  }
  if (composition) {
    elements = compositionToNPKElements(composition)
  }
  if (!convertMass) {
    // Оксиды нужны только для отображения.
    elements = elementsToNPK(elements)
  }
  return {
    id: fertilizerInfo.id,
    elements
  }

}

