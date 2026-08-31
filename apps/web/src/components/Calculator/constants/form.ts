import { normalizeConcentration } from "@fertilizer/calculator/dilution";
import type { CalculatorFormValues } from "../types";
import { DEFAULT_MICRO_RECIPE, DEFAULT_RECIPES } from "./recipes";

// Значения по умолчанию формы расчёта (бывший initialValues redux-form `calculatorOptions`).
export function getInitialFormValues(): CalculatorFormValues {
  return {
    accuracy: 0.2,
    solution_volume: 1,
    solution_concentration: normalizeConcentration(100),
    recipe: { ...DEFAULT_RECIPES[0].elements, ...DEFAULT_MICRO_RECIPE, Cl: 0 },
    fertilizers: [],
    dilution_enabled: false,
    dilution_concentration: normalizeConcentration(1),
    topping_up_enabled: false,
    mixerOptions: {},
  };
}
