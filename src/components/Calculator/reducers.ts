import {ActionTypes, CalculatorState} from "./types";
import * as ActionNames from "./constants";
import {buildNPKFertilizer, FertilizerInfo} from "../../calculator/fertilizer";
import {assertNever} from "../../redux-helpers/helpers";

export const defaultFertilizers: FertilizerInfo[] = [
  buildNPKFertilizer(
    "Valagro 3:11:38",
    {
      N: 3, P: 11, K: 38, Ca: 0, Mg: 4,
    }),
  buildNPKFertilizer("Кальциевая селитра",
    {
      N: 16, Ca: 24,
    }),
  buildNPKFertilizer("Сульфат магния", {Mg: 16}),
  buildNPKFertilizer("Сульфат калия", {K: 50}),
  buildNPKFertilizer("Нитрат калия", {N: 14, K: 46})
]

const initialState: CalculatorState = {
  result: null,
  process: false,
  error: false,
  fertilizers: defaultFertilizers
}


export const reducer = (state: CalculatorState = initialState, action: ActionTypes): CalculatorState => {
  switch (action.type) {
    case ActionNames.CALCULATE_START:
      return {...state, process: true}
    case ActionNames.CALCULATE_SUCCESS:
      return {...state, process: false, result: action.result}
    case ActionNames.CALCULATE_ERROR:
      return {...state, process: false, error: true}
    case ActionNames.FERTILIZERS_PUSH:
      return {...state, fertilizers: [...state.fertilizers, action.payload]}
    case ActionNames.FERTILIZERS_REMOVE:
      return {...state, fertilizers: state.fertilizers.filter(f => action.payload.id !== f.id) }
    case ActionNames.FERTILIZERS_RESET:
      return {...state, fertilizers: [...defaultFertilizers]}

    default:
      return assertNever<CalculatorState>(state, action)
  }
}
