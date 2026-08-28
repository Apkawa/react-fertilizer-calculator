import { calculate_v4 } from "@fertilizer/calculator";
import type { Concentration } from "@fertilizer/calculator/dilution";
import { normalizeFertilizer } from "@fertilizer/calculator/fertilizer";
import type { ExportStateType } from "@fertilizer/calculator/format/types";
import {
  calculateToppingUp,
  getEmptyElements,
  getNPKDetailInfo,
} from "@fertilizer/calculator/helpers";
import { create } from "zustand";
import { defaultFertilizers } from "@/components/Calculator/constants/fertilizers";
import { getInitialFormValues } from "@/components/Calculator/constants/form";
import { DEFAULT_RECIPES } from "@/components/Calculator/constants/recipes";
import type { AddEditFormType } from "@/components/Calculator/FertilizerManager/types";
import type { MixerFormType } from "@/components/Calculator/Mixer/MixerForm";
import type {
  CalculatorFormValues,
  CalculatorState,
  FertilizerInfo,
  Recipe,
} from "@/components/Calculator/types";
import { equal, update, updateOrPush } from "@/utils";
import { defaultCalculator, loadPersistedState, persistState } from "./persistence";

// Zustand-стор приложения (замена redux + redux-form + redux-saga).
// Единый источник состояния: слайс калькулятора (те же имена полей, что у redux)
// + состояния форм `fertilizerEdit` / `mixerOptions` (бывшие redux-form)
// + сообщение об ошибке выбора удобрений (бывшие redux-form syncErrors).
export interface AppState {
  calculator: CalculatorState;
  fertilizerEdit: AddEditFormType;
  mixerOptions: MixerFormType;
  fertilizersError: string | null;
}

export interface AppActions {
  // Форма расчёта: запись значения по dot-path в calculationForm
  setFieldValue(name: string, value: unknown): void;
  // Расчёт: guard полей → calculate_v4 + topping-up (одна проходимость, null-safe)
  calculate(): void;
  // Менеджер удобрений
  pushFertilizer(f: FertilizerInfo): void;
  removeFertilizer(f: FertilizerInfo): void;
  setFertilizers(list: FertilizerInfo[]): void;
  resetFertilizers(): void;
  // Рецепты
  pushRecipe(r: Recipe): void;
  removeRecipe(r: Recipe): void;
  resetRecipes(): void;
  // Импорт состояния (формат @fertilizer/calculator/format)
  importState(payload: ExportStateType): void;
  // Форма редактора удобрения: значение + пересчёт npk из composition
  setFertilizerEditField(name: string, value: unknown): void;
  // Форма миксера
  setMixerField(name: string, value: unknown): void;
  // Полный сброс к дефолтам (херметичность тестов)
  reset(): void;
}

export type Store = AppState & AppActions;

// Установка значения по dot-path ("topping_up.currentSolution.volume" → вложенный объект)
function setIn(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  const parts = path.split(".");
  const root = { ...obj };
  let node: Record<string, unknown> = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = { ...(typeof node[key] === "object" && node[key] !== null ? node[key] : {}) };
    node[key] = next;
    node = next;
  }
  node[parts[parts.length - 1]] = value;
  return root;
}

// Начальное состояние: персистентность (новый ключ appState / миграция) + дефолты
function buildInitialState(): AppState {
  const persisted = loadPersistedState();
  return {
    calculator: persisted?.calculator ?? defaultCalculator(),
    fertilizerEdit: persisted?.fertilizerEdit ?? ({} as AddEditFormType),
    mixerOptions: persisted?.mixerOptions ?? ({} as MixerFormType),
    fertilizersError: null,
  };
}

// Фабрика стора: каждый вызов создаёт свежий экземпляр, читающий персистентность.
// `useStore` — единственный экземпляр приложения; `createAppStore()` используется
// в тестах для «перезапуска» приложения (новый экземпляр читает localStorage).
export function createAppStore() {
  const store = create<Store>((set, get) => ({
    ...buildInitialState(),

    setFieldValue: (name, value) =>
      set((s) => {
        const form = s.calculator.calculationForm ?? getInitialFormValues();
        return {
          calculator: {
            ...s.calculator,
            calculationForm: setIn(
              form as unknown as Record<string, unknown>,
              name,
              value,
            ) as unknown as CalculatorFormValues,
          },
        };
      }),

    calculate: () => {
      const form = get().calculator.calculationForm;
      // Guard: пустая выборка → ошибка (аналог calculateError + stopSubmit в saga)
      if (!form?.fertilizers?.length) {
        set((s) => ({
          calculator: { ...s.calculator, process: false, error: true },
          fertilizersError: "Need fertilizers!",
        }));
        return;
      }

      // Топинг-ап: один проход — довести объём/концентрацию до расчёта topping-up,
      // затем пересчитать результат с доведёнными значениями (заменяет рекурсию saga).
      let workForm = { ...form };
      let toppingUpResult = get().calculator.toppingUpResult;
      if (workForm.topping_up_enabled && workForm.topping_up) {
        const tRes = calculateToppingUp({
          currentSolution: workForm.topping_up.currentSolution,
          newSolution: {
            ...workForm.topping_up.newSolution,
            EC: getNPKDetailInfo({ ...getEmptyElements(), ...workForm.recipe }).EC,
          },
        });
        toppingUpResult = tRes;
        workForm = {
          ...workForm,
          solution_volume: tRes.volume,
          // parity с redux saga: в форму кладётся number (calculate_v4 нормализует)
          solution_concentration: tRes.concentration as unknown as Concentration,
        };
      }

      const result = calculate_v4(workForm.recipe, workForm.fertilizers, {
        ignore: { ...workForm.ignore },
        accuracy: workForm.accuracy,
        solution_volume: workForm.solution_volume,
        solution_concentration: workForm.solution_concentration,
      });

      set((s) => ({
        calculator: {
          ...s.calculator,
          process: false,
          result,
          toppingUpResult,
          calculationForm: workForm,
        },
        fertilizersError: null,
      }));
    },

    pushFertilizer: (f) =>
      set((s) => {
        const fertilizers = updateOrPush(s.calculator.fertilizers, f, "id");
        // Синхронизация выборки по id (аналог fertilizerPushSaga)
        let calculationForm = s.calculator.calculationForm;
        if (calculationForm) {
          const [sel, updated] = update(calculationForm.fertilizers, f, "id");
          if (updated) {
            calculationForm = { ...calculationForm, fertilizers: sel };
          }
        }
        return { calculator: { ...s.calculator, fertilizers, calculationForm } };
      }),

    removeFertilizer: (f) =>
      set((s) => ({
        calculator: {
          ...s.calculator,
          fertilizers: s.calculator.fertilizers.filter((x) => x.id !== f.id),
        },
      })),

    setFertilizers: (list) => set((s) => ({ calculator: { ...s.calculator, fertilizers: list } })),

    resetFertilizers: () =>
      set((s) => ({ calculator: { ...s.calculator, fertilizers: [...defaultFertilizers] } })),

    pushRecipe: (r) =>
      set((s) => ({
        calculator: {
          ...s.calculator,
          recipes: updateOrPush(s.calculator.recipes, r, "name"),
        },
      })),

    removeRecipe: (r) =>
      set((s) => ({
        calculator: {
          ...s.calculator,
          recipes: s.calculator.recipes.filter((x) => x.name !== r.name),
        },
      })),

    resetRecipes: () =>
      set((s) => ({ calculator: { ...s.calculator, recipes: [...DEFAULT_RECIPES] } })),

    importState: (payload) =>
      set((s) => ({
        calculator: { ...s.calculator, ...(payload.calculator ?? {}) },
      })),

    setFertilizerEditField: (name, value) =>
      set((s) => {
        const form: AddEditFormType = { ...s.fertilizerEdit, [name]: value };
        // Пересчёт npk из composition (аналог updateFertilizerForm в saga менеджера)
        if (form.composition_enable) {
          const npk = normalizeFertilizer(
            { id: "", composition: form.composition },
            false,
          ).elements;
          if (!equal(form.npk, npk)) {
            form.npk = npk;
          }
          if (!form.composition?.length) {
            form.composition = [{ formula: "" }];
          }
        }
        return { fertilizerEdit: form };
      }),

    setMixerField: (name, value) =>
      set((s) => ({ mixerOptions: { ...s.mixerOptions, [name]: value } })),

    reset: () =>
      set({
        calculator: {
          calculationForm: null,
          result: null,
          toppingUpResult: null,
          process: false,
          error: false,
          fertilizers: [...defaultFertilizers],
          recipes: [...DEFAULT_RECIPES],
        },
        fertilizerEdit: {} as AddEditFormType,
        mixerOptions: {} as MixerFormType,
        fertilizersError: null,
      }),
  }));

  // Персистентность: запись при каждом изменении (аналог store.subscribe в redux)
  store.subscribe(() => persistState(store.getState()));
  return store;
}

export const useStore = createAppStore();
