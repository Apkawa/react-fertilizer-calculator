import {InferValuesTypes} from "@/redux-helpers/types";
import * as actions from "./actions";
import {CalculateResult} from "@/calculator";
import {Elements, FertilizerInfo, NeedElements} from "@/calculator/types";
import {FERTILIZER_ELEMENT_NAMES} from "@/calculator/constants";

export interface CalculatorFormValues {
  accuracy: number,
  solution_volume: number,
  solution_concentration: number,
  recipe: NeedElements,
  fertilizers: FertilizerInfo[],

  dilution_enabled: boolean,
  dilution_volume: number,
  dilution_concentration: number,
  ignore?: {
    [K in FERTILIZER_ELEMENT_NAMES]?: boolean
  }
}

export interface CalculatorState {
  readonly result: CalculateResult | null,
  readonly process: boolean,
  readonly error: boolean,
  readonly fertilizers: FertilizerInfo[]
  readonly recipes: Recipe[],
}

export interface Recipe {
  name: string,
  color?: string,
  elements: NeedElements
}

export type ActionTypes = ReturnType<InferValuesTypes<typeof actions>>
