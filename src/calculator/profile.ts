import {Elements, NPKElements} from "./types";
import {entries, round} from "../utils";
import {ATOMIC_MASS, MACRO_ELEMENT_NAMES} from "./constants";
import {extract_percent} from "./helpers";

export const ALLOWED_ELEMENT_IN_MATRIX = ["N", ...MACRO_ELEMENT_NAMES]
export type ALLOWED_ELEMENT_IN_MATRIX = typeof ALLOWED_ELEMENT_IN_MATRIX[number]

type ElementInMatrix<T = number> = {
  [K in ALLOWED_ELEMENT_IN_MATRIX]: T
}

export interface ElementsMatrixType extends ElementInMatrix<ElementInMatrix> {
}

export interface ProfileInfo {
  ratio: ElementsMatrixType
  anions: number,
  cations: number,
  ion_balance: number,
  EC: number
}

export interface ChangeProfileOptions {
  ratio: Partial<ElementInMatrix<Partial<ElementInMatrix>>>,
  EC: number,

}

export interface ChangeProfileResult {
  npk: Elements,
  info: ProfileInfo
}

// export function changeProfile(npk: Elements, options: ChangeProfileOptions): ChangeProfileResult {
//
// }

/**
 * Расчет соотношений N/K и тд
 * @param npk
 * @return ElementsMatrixType
 */
export function getProfileRatioMatrix(npk: NPKElements): ElementsMatrixType {
  let elMap: ElementInMatrix = {}
  for (let [El, ppm] of entries(npk)) {
    if (ALLOWED_ELEMENT_IN_MATRIX.includes(El)) {
      elMap[El] = ppm
    }
  }
  elMap.N = (npk.NH4 || 0) + (npk.NO3 || 0)
  return Object.fromEntries(entries(elMap).map(
    ([el, ppm]) =>
      [el, Object.fromEntries(entries(elMap).map(
        ([el2, ppm2]) => {
          let r = round(ppm / ppm2, 3)
          if (!isFinite(r)) {
            r = 0
          }
          return [el2, el === el2 ? 1 : r]
        }
        )
      )]
    )
  )
}

type PartialElementsMatrix = {
  [K in keyof ElementInMatrix]?: ElementInMatrix
}

export function convertProfileWithRatio(
  npk: NPKElements,
  ratio: PartialElementsMatrix): NPKElements {
  const newNPK: NPKElements = {...npk}
  const N = (newNPK.NO3 || 0) + (newNPK.NH4 || 0)
  const v = getProfileRatioMatrix(npk)
  for (let [el1, toEls] of entries(ratio)) {
    for (let [el2, r] of entries(toEls)) {
      if (el1 === el2) {
        continue
      }
      let f = (v: number, r: number) => v * r
      if (el1 === "N") {
        let _N = f((newNPK[el2 as MACRO_ELEMENT_NAMES] || 0), r)
        newNPK.NH4 = extract_percent(_N, v.NH4.NO3)
        newNPK.NO3 = _N - newNPK.NH4
      } else {
        let elM = newNPK[el2 as MACRO_ELEMENT_NAMES] || 0
        if (el2 === 'N') {
          elM = N
        }
        newNPK[el1 as MACRO_ELEMENT_NAMES] = elM * r
      }
    }
  }
  return Object.fromEntries(entries(newNPK)
    .map(([el, v]) => (
      [el, round(v, 1)]
    )))
}

/**
 * Copied from siv237/HPG
 * @param npk
 * @param EC new EC
 * @return new NPK
 */
export function convertProfileWithEC(npk: NPKElements, EC: number): NPKElements {
  // Конвертация профиля по формуле Зоневельда
  const v = getProfileRatioMatrix(npk)

  // TODO понять и отрефакторить эту магию
  const rN = (v.K.Mg * v.K.Ca) / (
    v.K.Ca * v.K.N + v.K.Mg * v.K.N + v.K.Mg * v.K.Ca + v.K.Mg * v.K.Ca * v.K.N
  );
  const rK = (v.K.N * v.K.Mg * v.K.Ca) / (
    v.K.Ca * v.K.N + v.K.Mg * v.K.N + v.K.Mg * v.K.Ca + v.K.Mg * v.K.Ca * v.K.N);
  const rCa = (v.K.Mg * v.K.N) / (
    v.K.Ca * v.K.N + v.K.Mg * v.K.N + v.K.Mg * v.K.Ca + v.K.Mg * v.K.Ca * v.K.N);
  const rMg = (v.K.Ca * v.K.N) / (
    v.K.Ca * v.K.N + v.K.Mg * v.K.N + v.K.Mg * v.K.Ca + v.K.Mg * v.K.Ca * v.K.N
  );
  const vNH4NO3 = (npk.NH4 || 0) / ((npk.NH4 || 0) + (npk.NO3 || 0))
  const rNH4 = (rN * vNH4NO3) / (1 + vNH4NO3);

  const molN = ATOMIC_MASS.N
  // const molP = ATOMIC_MASS.P
  const molK = ATOMIC_MASS.K
  const molCa = ATOMIC_MASS.Ca
  const molMg = ATOMIC_MASS.Mg

  const r = (
    0.10526315789473684211 * molN * molCa * molMg * molK * (100 * EC - 19)) / (
    rNH4 * molCa * molMg * molK
    + 2 * rCa * molN * molMg * molK
    + 2 * rMg * molN * molCa * molK
    + rK * molN * molCa * molMg
  );
  const N = rN * r;
  const NH4 = extract_percent(N, v.NH4.NO3)

  let newNpk = {
    ...npk,
    NH4,
    NO3: N - NH4,
    K: rK * r,
    Ca: rCa * r,
    Mg: rMg * r,
  }
  // TODO ионный баланс
  return Object.fromEntries(entries(newNpk)
    .map(([el, v]) => (
      [el, round(v, 1)]
    )))
}
