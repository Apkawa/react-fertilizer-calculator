export interface MacroElements<T=number> {
  NO3: T,
  NH4: T,
  P: T,
  K: T,
  Ca: T,
  Mg: T,
  S: T,
  Cl: T,
}

export interface MicroElements<T=number> {
  Fe: T,
  Mn: T,
  B: T,
  Zn: T,
  Cu: T,
  Mo: T,
  Co: T,
  Si: T,
}

/**
 * NPK чистых элементов
 */
export interface Elements<T=number> extends MacroElements<T>, MicroElements<T> {

}

/**
 * NPK рецепта чистых элементов
 */
export type NeedElements = {
  [E in keyof Elements]?: number
}

export interface Fertilizer {
  id: string,
  elements: Elements
}

/**
 * Состав удобрения
 * В виде формулы и её содержанием в %
 */
export interface FertilizerComposition {
  // As example: K2P2O5
  formula: string,
  // 0-100%
  percent?: number,
}

/**
 * Удобрение
 */
export interface FertilizerInfo {
  id: string,
  // TODO
  name?: string,
  // TODO обеспечить типами то что совместно npk и composition использовать нельзя
  // Оксидный NPK
  npk?: NPKElements,
  // Состав, в виде формулы
  composition?: FertilizerComposition[],
  // Концентрация солей, г/л
  solution_concentration?: number,
  // Плотность, г/л
  solution_density?: number

}

/**
 * NPK оксидов
 */
export type NPKElements = {
  [El in keyof Elements]?: Elements[El]
}
