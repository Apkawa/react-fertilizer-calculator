import {CalculateResult} from "@/calculator";
import {CalculatorFormValues, Recipe} from "@/components/Calculator/types";


export interface DiaryEntryType {
  title: string,
  description?: string,
  datetime: Date,
  calculationForm: CalculatorFormValues,
  result: CalculateResult,
  recipes: Recipe[],
}
