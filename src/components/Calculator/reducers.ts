import {ActionTypes, CalculatorState} from "./types";
import {CALCULATE_START, CALCULATE_SUCCESS} from "./constants";


const initialState: CalculatorState = {
  result: null,
  process: false,
  error: false,
}


export const reducer = (state: CalculatorState = initialState, action: ActionTypes): CalculatorState => {
  switch (action.type) {
    case CALCULATE_START:
      return {...state, process: true}
    case CALCULATE_SUCCESS:
      return {...state, process: false, result: action.result}
    default:
      return {...state}
  }
}
