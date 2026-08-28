import { defaultFertilizers } from "@/components/Calculator/constants/fertilizers";
import { DEFAULT_RECIPES } from "@/components/Calculator/constants/recipes";
import type { AddEditFormType } from "@/components/Calculator/FertilizerManager/types";
import type { MixerFormType } from "@/components/Calculator/Mixer/MixerForm";
import type { CalculatorState } from "@/components/Calculator/types";

// Персистентность zustand-стора: всё состояние пишется под новым ключом `appState`
// при каждом изменении. При первом запуске состояние мигрируется со старого
// redux-ключа `reduxState` (там только слайс `calculator`).
export const PERSIST_KEY = "appState";
const LEGACY_KEY = "reduxState";

export interface PersistedState {
  calculator: CalculatorState;
  fertilizerEdit?: AddEditFormType;
  mixerOptions?: MixerFormType;
}

// Дефолты слайса (аналог initialState reducer'а калькулятора)
export function defaultCalculator(): CalculatorState {
  return {
    calculationForm: null,
    result: null,
    toppingUpResult: null,
    process: false,
    error: false,
    fertilizers: [...defaultFertilizers],
    recipes: [...DEFAULT_RECIPES],
  };
}

// Нормализация слайса при загрузке: бэкинг дефолтов fertilizers/recipes
// и сброс runtime-полей process/error (они не должны восстанавливаться из хранилища).
function normalizeCalculator(calc: Partial<CalculatorState> | undefined): CalculatorState {
  // Собираем новый объект: поля CalculatorState readonly, мутация не возможна
  const base = { ...defaultCalculator(), ...(calc ?? {}) };
  return {
    ...base,
    fertilizers: base.fertilizers ?? [...defaultFertilizers],
    recipes: base.recipes ?? [...DEFAULT_RECIPES],
    process: false,
    error: false,
  };
}

function readJSON<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// Загрузка состояния: новый ключ `appState`; при его отсутствии —
// миграция со старого `reduxState` (запись `appState` + удаление старого ключа).
export function loadPersistedState(): PersistedState | null {
  const fresh = readJSON<PersistedState>(PERSIST_KEY);
  if (fresh) {
    return { ...fresh, calculator: normalizeCalculator(fresh.calculator) };
  }

  const legacy = readJSON<{ calculator?: Partial<CalculatorState> }>(LEGACY_KEY);
  if (legacy?.calculator) {
    const state: PersistedState = {
      calculator: normalizeCalculator(legacy.calculator),
    };
    localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
    localStorage.removeItem(LEGACY_KEY);
    return state;
  }

  return null;
}

// Запись состояния при каждом изменении (аналог store.subscribe в redux).
export function persistState(state: unknown): void {
  try {
    localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
  } catch {
    // localStorage недоступен/полон — тихо пропускаем
  }
}
