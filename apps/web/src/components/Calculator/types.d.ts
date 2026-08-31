import { CalculateResult } from "@fertilizer/calculator";
import { FERTILIZER_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { Concentration } from "@fertilizer/calculator/dilution";
import {
  CalculateToppingUpOptions,
  CalculateToppingUpResult,
} from "@fertilizer/calculator/helpers";
import { FertilizerInfo as _FertilizerInfo, NeedElements } from "@fertilizer/calculator/types";

export interface FertilizerInfo extends _FertilizerInfo {
  pump_number?: number;
}

export interface MixerOptions {
  url?: string;
}

export interface CalculatorFormValues {
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
  mixerOptions: MixerOptions;
}

export interface CalculatorState {
  readonly calculationForm: CalculatorFormValues | null;
  readonly result: CalculateResult | null;
  readonly toppingUpResult: CalculateToppingUpResult | null;
  readonly process: boolean;
  readonly error: boolean;
  readonly fertilizers: FertilizerInfo[];
  readonly recipes: Recipe[];
}

export interface Recipe {
  name: string;
  color?: string;
  elements: NeedElements;
}
