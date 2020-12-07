import {InferValuesTypes} from "@/redux-helpers/types";
import * as actions from "./actions";
import {CalculateResult} from "@/calculator";
import {FertilizerInfo, NeedElements} from "@/calculator/types";
import {FERTILIZER_ELEMENT_NAMES} from "@/calculator/constants";
import {CalculateToppingUpOptions, CalculateToppingUpResult} from "@/calculator/helpers";

export interface CalculatorFormValues {
  accuracy: number,
  solution_volume: number,
  solution_concentration: number,
  recipe: NeedElements,
  fertilizers: FertilizerInfo[],
  dilution_enabled: boolean,
  dilution_volume: number,
  dilution_concentration: number,

  topping_up_enabled: boolean,
  topping_up?: CalculateToppingUpOptions,
  ignore?: {
    [K in FERTILIZER_ELEMENT_NAMES]?: boolean
  }
}

export interface CalculatorState {
  readonly calculationForm: CalculatorFormValues | null,
  readonly result: CalculateResult | null,
  readonly toppingUpResult: CalculateToppingUpResult | null,
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
