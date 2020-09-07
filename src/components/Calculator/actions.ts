import {CALCULATE_ERROR, CALCULATE_START, CALCULATE_SUCCESS} from "./constants";
import {CalculateResult} from "../../calculator";

export const calculateStart = () => ({
  type: CALCULATE_START,
} as const)

export const calculateSuccess = (result: CalculateResult) => ({
  type: CALCULATE_SUCCESS,
  result
} as const)

export const calculateError = () => ({
  type: CALCULATE_ERROR,
} as const)


