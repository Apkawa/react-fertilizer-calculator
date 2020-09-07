import {Elements, FertilizerInfo} from "../../calculator/fertilizer";
import {InferValuesTypes} from "../../redux/types";
import * as actions from "./actions";
import {CalculateResult} from "../../calculator";

export interface CalculatorFormValues {
  accuracy: number,
  solution_volume: number,
  recipe: Elements,
  fertilizers: FertilizerInfo[],
  ignore_Ca?: boolean,
  ignore_Mg?: boolean,
}

export interface CalculatorState {
  result: CalculateResult | null,
  process: boolean,
  error: boolean
}


export type ActionTypes = ReturnType<InferValuesTypes<typeof actions>>
