import * as ActionNames from "./constants";
import {CalculateResult} from "../../calculator";
import {FertilizerInfo} from "../../calculator/fertilizer";

export const calculateStart = () => ({
  type: ActionNames.CALCULATE_START,
} as const)

export const calculateSuccess = (result: CalculateResult) => ({
  type: ActionNames.CALCULATE_SUCCESS,
  result
} as const)

export const calculateError = () => ({
  type: ActionNames.CALCULATE_ERROR,
} as const)

export const fertilizerPush = (payload: FertilizerInfo) => ({
  type: ActionNames.FERTILIZERS_PUSH,
  payload
})

export const fertilizerRemove = (payload: FertilizerInfo) => ({
  type: ActionNames.FERTILIZERS_REMOVE,
  payload
})

export const fertilizerReset = () => ({
  type: ActionNames.FERTILIZERS_RESET,
})


