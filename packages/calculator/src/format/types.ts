import type { FERTILIZER_ELEMENT_NAMES } from "../constants";
import type { Concentration } from "../dilution";
import type { CalculateToppingUpOptions } from "../helpers";
import type { CalculateResult } from "../index";
import type { FertilizerInfo, NeedElements } from "../types";

/**
 * Рецепт (структурная копия типа приложения)
 */
export interface Recipe {
  name: string;
  color?: string;
  elements: NeedElements;
}

/**
 * Форма расчёта — структурная копия CalculatorFormValues приложения.
 * Пакет не знает типов приложения; совместимость держится на структурной типизации.
 */
export interface ExportCalculationForm {
  accuracy: number;
  solution_volume: number;
  solution_concentration: Concentration;
  recipe: NeedElements;
  fertilizers: FertilizerInfo[];

  dilution_enabled?: boolean;
  dilution_volume?: number;
  dilution_concentration: Concentration;

  topping_up_enabled?: boolean;
  topping_up?: CalculateToppingUpOptions;

  ignore?: {
    [K in FERTILIZER_ELEMENT_NAMES]?: boolean;
  };

  mixerOptions: {
    url?: string;
  };
}

/**
 * Состояние экспорта/импорта: всё, что нужно для переноса расчёта между сессиями.
 */
export interface ExportStateType {
  meta: {
    version: string;
    ref: string;
    created: string;
  };
  calculator: {
    // null до первого раскрытия формы в приложении (соответствует CalculatorState)
    calculationForm: ExportCalculationForm | null;
    result: CalculateResult | null;
    fertilizers: FertilizerInfo[];
    recipes: Recipe[];
  };
}
