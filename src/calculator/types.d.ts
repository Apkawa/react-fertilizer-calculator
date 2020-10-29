export interface MacroElements<T=number> {
  NO3: T,
  NH4: T,
  P: T,
  K: T,
  Ca: T,
  Mg: T,
  S: T
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

export interface Elements<T=number> extends MacroElements<T>, MicroElements<T> {

}

export type NeedElements = {
  [E in keyof Elements]?: number
}

export interface Fertilizer {
  id: string,
  elements: Elements
}

export interface FertilizerComposition {
  // As example:
  formula: string,
  // 0-100%
  percent?: number,
}

export interface FertilizerInfo {
  id: string,
  // TODO
  name?: string,
  npk?: NPKElements,
  composition?: FertilizerComposition[],
  solution_density?: number

}

export type NPKElements = {
  [El in keyof Elements]?: Elements[El]
}
