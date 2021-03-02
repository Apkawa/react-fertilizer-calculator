import {entries, keys, round, sum, values} from "../utils";
import {calculateMassParts, parseMolecule, parseNitrates} from "./chem";
import {AtomNameType} from "./constants";
import {getEmptyElements} from "./helpers";
import {Elements, Fertilizer, FertilizerComposition, FertilizerInfo, NPKElements} from "@/calculator/types";
import {FertilizerWeights} from "@/calculator/index";

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
    composition,
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
          elements[a as keyof Elements] += percent * mass
        }
      }
    }
  }
  for (let k of keys(elements)) {
    if (elements[k]) {
      elements[k] = round(elements[k], 3)
    }
  }
  return elements
}

/**
 * Конвертация чистых элементов в NPK оксиды
 * @param {Elements} elements - чистые элементы
 */
export function elementsToNPK(elements: NPKElements, precision = 3): Elements {
  const e = entries(elements).map(([atom, val]) => {
    const oxide: string = (NPKOxides as any)[atom] || atom
    const massParts = calculateMassParts(parseMolecule(oxide))
    const skipElements = massParts.hasOwnProperty("N") || massParts.hasOwnProperty("S")
    const elementMassPart = massParts[atom as AtomNameType]
    if (!skipElements && elementMassPart) {
      const k = round(sum(values(massParts)) / elementMassPart, precision)
      val = round(val * k, precision)
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


export interface BuildFertilizerFromSolutionOptions {
  fertilizers: FertilizerInfo[],
  fertilizer_weights: FertilizerWeights[],
  // По умолчанию - 1л
  volume?: number | null,
}

/*
  Создание комплексного удобрения из расчета.
  Таким образом можно учитывать заранее намешанные концентраты
 */
export function buildFertilizerFromSolution(id: string, options: BuildFertilizerFromSolutionOptions): FertilizerInfo {
  const _fertsWeights = Object.fromEntries(options.fertilizer_weights.map(f => [f.id, f]))
  const totalWeight = sum(options.fertilizer_weights.map(f => f.weight))
  const totalWeightPerElements = getEmptyElements()
  let newNpk: NPKElements = {};

  for (let f of options.fertilizers) {
    if (!_fertsWeights?.[f.id]) {
      continue
    }
    const f_weight = _fertsWeights?.[f.id]
    const nf = normalizeFertilizer(f)
    for (let [_el, _el_percent] of entries(nf.elements)) {
      if (_el_percent > 0) {
        totalWeightPerElements[_el] += f_weight.weight * (_el_percent / 100)
      }
    }
  }

  for (let [el, el_weight] of entries(totalWeightPerElements)) {
    if (el_weight > 0) {
      newNpk[el] = (el_weight * 100) / totalWeight
    }
  }

  const newFertilizer: FertilizerInfo = {
    id,
    npk: elementsToNPK(newNpk, 3),
    solution_concentration: totalWeight / (options.volume || 1)
  }
  return newFertilizer;
}
