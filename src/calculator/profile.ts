import {Elements, NPKElements} from "./types";
import {entries, round} from "../utils";
import {ATOMIC_MASS, FERTILIZER_ELEMENT_NAMES, NPKOxides} from "./constants";
import {HPGFormat} from "./format/hpg";
import {compositionToElements, elementsToNPK} from "./fertilizer";
import {ElementsMatrixType, getProfileRatioMatrix} from "./ratio";

// export interface ProfileInfo {
//   ratio: ElementsMatrixType
//   anions: number,
//   cations: number,
//   ion_balance: number,
//   EC: number
// }

// export interface ChangeProfileOptions {
//   ratio: Partial<ElementInMatrix<Partial<ElementInMatrix>>>,
//   EC: number,
//
// }
//
// export interface ChangeProfileResult {
//   npk: Elements,
//   info: ProfileInfo
// }
//
// // export function changeProfile(npk: Elements, options: ChangeProfileOptions): ChangeProfileResult {
// //
// // }

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

  const r_N = K_KCa * K_KMg / (K_KCa * K_KMg * K_KN + K_KCa * K_KMg + K_KCa * K_KN + K_KMg * K_KN)
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


/**
 *
 * @param profile string like `NO3=13.577 K2O=45.668 Fe=6`
 * @return NPKElements
 */
export function parseProfileStringToNPK(profile: string): NPKElements {
  const elements: Partial<Elements> = {}
  const p = HPGFormat.parseProfileStringToObject(profile)
  for (let [k, v] of Object.entries(p)) {
    if (!Number.isFinite(v)) {
      continue
    }

    // Частный случай, когда вводим N но подразумеваем NO3
    if (k === "N") {
      k = "NO3"
    }

    if (FERTILIZER_ELEMENT_NAMES.includes(k as FERTILIZER_ELEMENT_NAMES)) {
      elements[k as FERTILIZER_ELEMENT_NAMES] = v
    } else {
      // Может быть это какой то оксид. Может даже целое уравнение.
      const npkEl = compositionToElements(
        // Представим это как химическую формулу
        [{percent: v, formula: k}])
      for (const [_e, _p] of entries(npkEl)) {
        if (_p) {
          elements[_e] = (elements[_e] || 0) + _p
        }
      }
    }
  }
  // Конвертируем в оксидную форму
  return elementsToNPK(elements)
}

/**
 *
 * @param npk
 * @returns string like `NO3=13.577 K2O=45.668 Fe=6`
 */
export function stringifyProfile(npk: NPKElements): string {
  let s = FERTILIZER_ELEMENT_NAMES.map(
    e => {
      if (npk[e]) {
        let n = e as string;
        // Т.к. оперируем оксидами, то оксиды выводим как оксиды
        if (NPKOxides.hasOwnProperty(e)) {
          n = NPKOxides[e] as string
        }
        return `${n}=${npk[e]}`
      }
      return undefined
    })
    .filter(e => e).join(' ')
  return `${s}`
}