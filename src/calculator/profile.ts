import {Elements, NPKElements} from "./types";
import {entries, round} from "../utils";
import {ATOMIC_MASS} from "./constants";

export const ALLOWED_ELEMENT_IN_MATRIX = ["N", "P", "K", "Ca", "Mg", "S"]

type ElementInMatrix<T = number> = {
  [K in typeof ALLOWED_ELEMENT_IN_MATRIX[number]]: T
}

export type ElementsMatrixType = ElementInMatrix<ElementInMatrix>

export interface ProfileInfo {
  elements_matrix: ElementsMatrixType
  '%NH4': number,
  anions: number,
  cations: number,
  ion_balance: number,
  EC: number
}

export interface ChangeProfileOptions extends Partial<Omit<ProfileInfo, 'elements_matrix'>> {
  elements_matrix: Partial<ElementsMatrixType>
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
    let name: typeof El | "N" = El
    if (El === 'NH4') {
      continue
    }
    if (El === 'NO3') {
      name = 'N'
      ppm = ppm + (npk['NH4'] || 0)
    }
    if (ALLOWED_ELEMENT_IN_MATRIX.includes(name)) {
      elMap[name] = ppm
    }
  }
  return Object.fromEntries(entries(elMap).map(
    ([el, ppm]) =>
      [el, Object.fromEntries(entries(elMap).map(
        ([el2, ppm2]) => {
          let r = round(ppm / ppm2, 3)
          if (!isFinite(r)) {
            r = 0
          }
          return [el2, el === el2 ? 1: r]
        }
        )
      )]
    )
  )
}

/**
 * Copied from siv237/HPG
 * @param npk
 * @param EC new EC
 * @return new NPK
 */
export function convertProfileWithEC(npk: NPKElements, EC: number): NPKElements {

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
  const vNH4NO3 = (npk.NH4 || 0) / ((npk.NH4|| 0) + (npk.NO3||0))
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
  const N = round(rN * r);
  const NH4 = round(rNH4 * r);

  return {
    ...npk,
    NH4,
    NO3 : round(N - NH4),
    K : round(rK * r),
    Ca : round(rCa * r),
    Mg : round(rMg * r),
  }
}
