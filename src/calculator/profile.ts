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

interface ProfileCationsAnionsResult {
  cations: number,
  anions: number,
}

export function profileCationsAnions(npk: NPKElements): ProfileCationsAnionsResult {
  const cations = (
    ((npk.NH4 || 0) / ATOMIC_MASS.N)
    + ((npk.K || 0) / ATOMIC_MASS.K)
    + ((2 * (npk.Ca || 0)) / ATOMIC_MASS.Ca)
    + ((2 * (npk.Mg || 0)) / ATOMIC_MASS.Mg)
  )
  const anions = (
    ((npk.NO3 || 0) / ATOMIC_MASS.N)
    + ((npk.P || 0) / ATOMIC_MASS.P)
    + ((2 * (npk.S || 0)) / ATOMIC_MASS.S)
    + ((npk.Cl || 0) / ATOMIC_MASS.Cl)
  )

  return {
    cations,
    anions
  }
}

/**
 * Расчет ЕС профиля по формуле Зоневельд
 * @param npk
 */
export function calculateEC(npk: NPKElements): number {
  const cations = profileCationsAnions(npk).cations
  return round((0.095 * cations) + 0.19, 3)
}

/**
 * Расчет ионного баланса
 * @param npk
 */
export function calculateIonicBalance(npk: NPKElements): number {
  const cat_an = profileCationsAnions(npk)
  return round(cat_an.cations - cat_an.anions, 3)

}

/**
 * Нормализация ионного баланса по сере
 * @param npk
 */
export function fixIonicBalanceByS(npk: NPKElements): number {
  const M_NH4 = ATOMIC_MASS.N;
  const M_NO3 = ATOMIC_MASS.N;
  const M_P = ATOMIC_MASS.P;
  const M_K = ATOMIC_MASS.K;
  const M_Ca = ATOMIC_MASS.Ca;
  const M_Mg = ATOMIC_MASS.Mg;
  const M_S = ATOMIC_MASS.S;
  const M_Cl = ATOMIC_MASS.Cl;

  const m_NH4 = npk.NH4 || 0;
  const m_NO3 = npk.NO3 || 0;
  const m_P = npk.P || 0;
  const m_K = npk.K || 0;
  const m_Ca = npk.Ca || 0;
  const m_Mg = npk.Mg || 0;
  const m_Cl = npk.Cl || 0;

  // Формула получена путем обратного решения формулы ионного баланса
  const mS = (
    (
      -M_Ca * M_Cl * M_K * M_Mg * M_NH4 * M_NO3 * M_S * m_P
      - M_Ca * M_Cl * M_K * M_Mg * M_NH4 * M_P * M_S * m_NO3
      + M_Ca * M_Cl * M_K * M_Mg * M_NO3 * M_P * M_S * m_NH4
      + 2 * M_Ca * M_Cl * M_K * M_NH4 * M_NO3 * M_P * M_S * m_Mg
      + M_Ca * M_Cl * M_Mg * M_NH4 * M_NO3 * M_P * M_S * m_K
      - M_Ca * M_K * M_Mg * M_NH4 * M_NO3 * M_P * M_S * m_Cl
      + 2 * M_Cl * M_K * M_Mg * M_NH4 * M_NO3 * M_P * M_S * m_Ca
    ) / (2 * M_Ca * M_Cl * M_K * M_Mg * M_NH4 * M_NO3 * M_P)
  )
  return round(mS, 3)
}

/**
 * Нормализация ионного баланса по кальцию
 * @param npk
 */
export function fixIonicBalanceByCa(npk: NPKElements): number {
  const M_NH4 = ATOMIC_MASS.N;
  const M_NO3 = ATOMIC_MASS.N;
  const M_P = ATOMIC_MASS.P;
  const M_K = ATOMIC_MASS.K;
  const M_Ca = ATOMIC_MASS.Ca;
  const M_Mg = ATOMIC_MASS.Mg;
  const M_S = ATOMIC_MASS.S;
  const M_Cl = ATOMIC_MASS.Cl;

  const m_NH4 = npk.NH4 || 0;
  const m_NO3 = npk.NO3 || 0;
  const m_P = npk.P || 0;
  const m_K = npk.K || 0;
  const m_Mg = npk.Mg || 0;
  const m_S = npk.S || 0;
  const m_Cl = npk.Cl || 0;

  // Формула получена путем обратного решения формулы ионного баланса
  const mCa = (
    (2 * M_Ca * M_Cl * M_K * M_Mg * M_NH4 * M_NO3 * M_P * m_S
      + M_Ca * M_Cl * M_K * M_Mg * M_NH4 * M_NO3 * M_S * m_P
      + M_Ca * M_Cl * M_K * M_Mg * M_NH4 * M_P * M_S * m_NO3
      - M_Ca * M_Cl * M_K * M_Mg * M_NO3 * M_P * M_S * m_NH4
      - 2 * M_Ca * M_Cl * M_K * M_NH4 * M_NO3 * M_P * M_S * m_Mg
      - M_Ca * M_Cl * M_Mg * M_NH4 * M_NO3 * M_P * M_S * m_K
      + M_Ca * M_K * M_Mg * M_NH4 * M_NO3 * M_P * M_S * m_Cl
    ) / (2 * M_Cl * M_K * M_Mg * M_NH4 * M_NO3 * M_P * M_S)
  )
  return round(mCa, 3)
}

/**
 * Расчет матрицы соотношений
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

/**
 * Конвертирование npk используя матрицу соотношений
 * Смысл в том чтобы корректировать npk рецепта по соотношениям отдельных элементов K:N, K:Mg и тд
 * Подробнее https://github.com/WEGA-project/WEGA-HPG/wiki#general-ppm
 * @param npk
 * @param ratio
 */
export function convertProfileWithRatio(
  npk: NPKElements,
  ratio: PartialElementsMatrix): NPKElements {
  const EC = calculateEC(npk)
  const v = getProfileRatioMatrix(npk)

  let newNPK: NPKElements = {...npk}
  for (let [el1, toEls] of entries(ratio)) {
    for (let [el2, r] of entries(toEls)) {
      if (el1 === el2) {
        continue
      }
      let f = (v: number, r: number) => v * r
      v[el1][el2] = r
      if (el1 === "N") {
        let _N = f((newNPK[el2 as MACRO_ELEMENT_NAMES] || 0), r)
        newNPK.NH4 = extract_percent(_N, v.NH4.NO3)
        newNPK.NO3 = _N - newNPK.NH4
      } else {
        let elM = newNPK[el2 as MACRO_ELEMENT_NAMES] || 0
        if (el2 === 'N') {
          elM = (newNPK.NO3 || 0) + (newNPK.NH4 || 0)
        }
        newNPK[el1 as MACRO_ELEMENT_NAMES] = elM * r
      }
    }
  }

  newNPK = convertProfileWithEC(newNPK, EC, v)
  return Object.fromEntries(entries(newNPK)
    .map(([el, v]) => (
      [el, round(v, 1)]
    )))
}

/**
 * Обновления профиля по ЕС
 * Copied from siv237/HPG
 * @param npk
 * @param EC new EC
 * @param ratio
 * @return new NPK
 */
export function convertProfileWithEC(npk: NPKElements, EC: number, ratio?: ElementsMatrixType): NPKElements {
  // Конвертация профиля по формуле Зоневельда

  const v = ratio || getProfileRatioMatrix(npk)

  const K_KN = v.K.N
  const K_KMg = v.K.Mg
  const K_KCa = v.K.Ca
  const K_NH4NO3 = v.NH4.NO3

  const r_N = K_KCa*K_KMg/(K_KCa*K_KMg*K_KN + K_KCa*K_KMg + K_KCa*K_KN + K_KMg*K_KN)
  const r_NH4 = (K_NH4NO3 * r_N) / (K_NH4NO3 + 1)
  const r_NO3 = r_N / (K_NH4NO3 + 1)

  const r_K = K_KCa * K_KMg * K_KN / ((K_KCa * K_KMg * K_KN) + (K_KCa * K_KMg) + (K_KCa * K_KN + K_KMg * K_KN))
  const r_Ca = K_KMg * K_KN / (K_KCa * K_KMg * K_KN + K_KCa * K_KMg + K_KCa * K_KN + K_KMg * K_KN)
  const r_Mg = K_KCa * K_KN / (K_KCa * K_KMg * K_KN + K_KCa * K_KMg + K_KCa * K_KN + K_KMg * K_KN)

  const M_NH4 = ATOMIC_MASS.N;
  const M_K = ATOMIC_MASS.K;
  const M_Ca = ATOMIC_MASS.Ca;
  const M_Mg = ATOMIC_MASS.Mg;

  const m_NH4 = r_NH4;
  const m_K = r_K;
  const m_Ca = r_Ca;
  const m_Mg = r_Mg;

  const r = (
    (200.0 * EC * M_Ca * M_K * M_Mg * M_NH4 - 38.0 * M_Ca * M_K * M_Mg * M_NH4)
    / (19.0 * M_Ca * M_K * M_Mg * m_NH4 + 38.0 * M_Ca * M_K * M_NH4 * m_Mg
      + 19.0 * M_Ca * M_Mg * M_NH4 * m_K + 38.0 * M_K * M_Mg * M_NH4 * m_Ca)
  )

  let newNpk = {
    ...npk,
    NH4: r_NH4 * r,
    NO3: r_NO3 * r,
    K: r_K * r,
    Ca: r_Ca * r,
    Mg: r_Mg * r,
  }
  // Пересчет ионного баланса по сере
  newNpk.S = fixIonicBalanceByS(newNpk)

  return Object.fromEntries(entries(newNpk)
    .map(([el, v]) => (
      [el, round(v, 1)]
    )))
}


