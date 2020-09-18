import {InferValuesTypes} from "@/redux-helpers/types";
import * as actions from "./actions";
import {CalculateResult} from "@/calculator";
import {Elements, FertilizerInfo} from "@/calculator/types";
import {FERTILIZER_ELEMENT_NAMES} from "@/calculator/constants";

export interface CalculatorFormValues {
  accuracy: number,
  solution_volume: number,
  solution_concentration: number,
  recipe: Elements,
  fertilizers: FertilizerInfo[],

  dilution_enabled: boolean,
  dilution_volume: number,
  dilution_concentration: number,

  ignore_Ca?: boolean,
  ignore_Mg?: boolean,
  ignore_S?: boolean,
  // TODO
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
  elements: Elements
}

export type ActionTypes = ReturnType<InferValuesTypes<typeof actions>>
