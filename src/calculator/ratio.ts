import {NPKElements} from "./types";
import {entries, round} from "../utils";
import {MACRO_ELEMENT_NAMES} from "./constants";
import {extract_percent} from "./helpers";
import {calculateEC, convertProfileWithEC} from "./profile";


export const ALLOWED_ELEMENT_IN_MATRIX = ["N", ...MACRO_ELEMENT_NAMES]
export type ALLOWED_ELEMENT_IN_MATRIX = typeof ALLOWED_ELEMENT_IN_MATRIX[number]
type ElementInMatrix<T = number> = {
  [K in ALLOWED_ELEMENT_IN_MATRIX]: T
}

export interface ElementsMatrixType extends ElementInMatrix<ElementInMatrix> {
  //  ElementsMatrixType.N.K must be equal N / K
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
              let r = 1;
              if (el !== el2) {
                if (ppm2 === 0) {
                  r = 0
                } else {
                  r = round(ppm / ppm2, 3)
                  if (!isFinite(r)) {
                    r = 0
                  }
                }
              }
              return [el2, r]
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


export interface MultiElementRatio {
  elements: ALLOWED_ELEMENT_IN_MATRIX[],
  ratio: number[],
  matrix: Partial<ElementInMatrix>,
  display: string,
}
/**
 *
 * @param npk is NPKElements
 * @param elements is array of elements name, ['K', 'Ca', 'Mg']
 * @return MultiElementRatio, example:
 * ```js
 * {
 *  elements: ['K', 'Ca', 'Mg'],
 *  ratio: [5, 3, 1],
 *  matrix: {'K': 5, 'Ca': 3, 'Mg': 1}
 * }
 * ```
 */
export function getMultiElementRatio(npk: NPKElements, elements: ALLOWED_ELEMENT_IN_MATRIX[]): MultiElementRatio {
  const ratio = getMultiRatio(elements.map(e => {
    if (e === "N") {
      return (npk.NO3 || 0) + (npk.NH4 || 0)
    }
    return npk[e as MACRO_ELEMENT_NAMES] || 0
  }))

  return {
    elements,
    ratio,
    matrix: Object.fromEntries(elements.map((e, i) => [e, ratio[i]])),
    display: ratio.map(s => s.toString()).join(":")

  }
}

/**
 *
 * @param arr is number[] [80, 180, 40]
 * @return number[] [2,4.5,1]
 */
export function getMultiRatio(arr: number[]): number[] {
  const base = Math.min(...arr)
  const baseIndex = arr.indexOf(base)
  return arr.map((n, i) => {
    if (baseIndex === i) {
      return 1
    }
    return round(n / base, 1)
  })
}