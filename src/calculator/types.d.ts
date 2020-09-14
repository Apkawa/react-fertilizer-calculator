export interface Elements {
  NO3: number,
  NH4: number,
  P: number,
  K: number,
  Ca: number,
  Mg: number,
  S: number
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
  composition: FertilizerComposition[],
}

export type NPKElements = {
  [El in keyof Elements]?: Elements[El]
}
