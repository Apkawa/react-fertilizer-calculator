import {CalculatorState} from "@/components/Calculator/types";

export interface ExportStateType {
  meta: {
    version: string,
    ref: string,
    created: string
  },
  calculator: Pick<CalculatorState, 'calculationForm' | 'result' | 'fertilizers' | 'recipes'>
}
