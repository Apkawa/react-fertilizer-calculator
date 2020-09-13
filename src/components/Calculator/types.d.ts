import {Elements, FertilizerInfo} from "@/calculator/fertilizer";
import {InferValuesTypes} from "@/redux-helpers/types";
import * as actions from "./actions";
import {CalculateResult} from "@/calculator";

export interface CalculatorFormValues {
  accuracy: number,
  solution_volume: number,
  solution_concentration: number,
  recipe: Elements,
  fertilizers: FertilizerInfo[],
  ignore_Ca?: boolean,
  ignore_Mg?: boolean,
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
