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
  S: 'S',
}

export function buildNPKFertilizer(id: string, npk: NPKElements): FertilizerInfo {
  const composition: FertilizerComposition[] = entries(npk)
    .filter(v => v[1] > 0)
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

// Расчет состава удобрения в чистые элементы
export function normalizeFertilizer(fertilizerInfo: FertilizerInfo, convertMass = true): Fertilizer {
  const elements: Elements = getEmptyElements()
  for (let comp of fertilizerInfo.composition) {
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
  if (!convertMass) {
    // Оксиды нужны только для отображения.
    keys(elements).forEach(atom => {
      const oxide = NPKOxides[atom]
      const massParts = calculateMassParts(parseMolecule(oxide))
      if (massParts.hasOwnProperty("N") || massParts.hasOwnProperty("S")) {

        // ничего не делаем, азот не переводим в оксиды
        return
      }
      const elementMassPart = massParts[atom as AtomNameType]
      if (elementMassPart) {
        const k = round(sum(values(massParts)) / elementMassPart, 2)
        elements[atom] = round(elements[atom] * k, 2)
      }
    })
  }
  return {
    id: fertilizerInfo.id,
    elements
  }

}

