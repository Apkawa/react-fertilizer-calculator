import {ActionTypes, CalculatorState} from "./types";
import * as ActionNames from "./constants";
import {assertNever} from "@/redux-helpers/helpers";
import {defaultFertilizers} from "./constants/fertilizers";
import {DEFAULT_RECIPES} from "./constants/recipes";

const initialState: CalculatorState = {
  result: null,
  process: false,
  error: false,
  fertilizers: defaultFertilizers,
  recipes: DEFAULT_RECIPES,
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
      return {...state, fertilizers: state.fertilizers.filter(f => action.payload.id !== f.id)}
    case ActionNames.FERTILIZERS_RESET:
      return {...state, fertilizers: [...defaultFertilizers]}

    case ActionNames.RECIPE_PUSH:
      return {...state, recipes: [...state.recipes, action.payload]}
    case ActionNames.RECIPE_REMOVE:
      return {...state, recipes: state.recipes.filter(f => action.payload.name !== f.name)}
    case ActionNames.RECIPE_RESET:
      return {...state, recipes: [...DEFAULT_RECIPES]}

    default:
      return assertNever<CalculatorState>(state, action)
  }
}
