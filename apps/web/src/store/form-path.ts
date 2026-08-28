import { REDUX_FORM_NAME } from "@/components/Calculator/constants";
import type { AppState } from "./index";

// Возвращает значение по dot-path внутри формы (calculatorOptions/fertilizerEdit/mixerOptions)
export function getFormValueAt(state: AppState, formName: string, path: string): unknown {
  const root: unknown =
    formName === REDUX_FORM_NAME
      ? state.calculator.calculationForm
      : formName === "fertilizerEdit"
        ? state.fertilizerEdit
        : formName === "mixerOptions"
          ? state.mixerOptions
          : null;
  if (!root) return undefined;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return acc;
    return (acc as Record<string, unknown>)[key];
  }, root);
}
