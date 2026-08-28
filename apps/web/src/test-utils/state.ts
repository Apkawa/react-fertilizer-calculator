/**
 * Тестовый шов: доступ к состоянию приложения без привязки к конкретной стеку.
 * Поведенческие тесты (__tests__/*.behavior.test.tsx) зависят только от этого модуля:
 * при переходе с redux + redux-form + saga на zustand меняется только эта реализация,
 * тела тестов остаются без изменений.
 */

import type { ExportStateType } from "@fertilizer/calculator/format/types";
import type { FertilizerInfo } from "@fertilizer/calculator/types";
import { change, reset } from "redux-form";
import {
  calculateStart,
  fertilizerPush,
  fertilizerReset,
  fertilizerSet,
  loadStateStart,
  loadStateSuccess,
} from "@/components/Calculator/actions";
import { REDUX_FORM_NAME } from "@/components/Calculator/constants";
import { defaultFertilizers } from "@/components/Calculator/constants/fertilizers";
import { DEFAULT_RECIPES } from "@/components/Calculator/constants/recipes";
import { FERTILIZER_EDIT_FORM_NAME } from "@/components/Calculator/FertilizerManager/constants";
import type { AddEditFormType } from "@/components/Calculator/FertilizerManager/types";
import type { CalculatorState } from "@/components/Calculator/types";
import { store } from "@/redux";

// Снимок части состояния, которую проверяют поведенческие тесты
export type AppSnapshot = CalculatorState;

// Корневое состояние: слайс калькулятора + формы
type RootState = {
  calculator: CalculatorState;
  form?: {
    [form: string]: {
      values?: Record<string, unknown>;
      syncErrors?: { [field: string]: { _error?: string } };
    };
  };
};

const rootState = (): RootState => store.getState() as unknown as RootState;

export const getState = (): AppSnapshot => rootState().calculator;

// Поле формы расчета (dot-path)
export const setFormField = (name: string, value: unknown): void => {
  store.dispatch(change(REDUX_FORM_NAME, name, value));
};

// Запуск расчета (минуя валидацию формы)
export const calculateNow = (): void => {
  store.dispatch(calculateStart());
};

// Менеджер удобрений
export const pushFertilizer = (f: FertilizerInfo): void => {
  store.dispatch(fertilizerPush(f));
};

export const setFertilizers = (list: FertilizerInfo[]): void => {
  store.dispatch(fertilizerSet(list));
};

export const resetFertilizers = (): void => {
  store.dispatch(fertilizerReset());
};

// Импорт состояния
export const importState = (payload: ExportStateType): void => {
  store.dispatch(loadStateStart(payload));
};

// Сообщение об ошибке на поле fertilizers формы расчета
export const getFertilizersError = (): string | undefined =>
  rootState().form?.[REDUX_FORM_NAME]?.syncErrors?.fertilizers?._error;

// Форма редактирования удобрения
export const getFertilizerEditForm = (): AddEditFormType =>
  rootState().form?.[FERTILIZER_EDIT_FORM_NAME]?.values as unknown as AddEditFormType;

export const setFertilizerEditField = (name: string, value: unknown): void => {
  store.dispatch(change(FERTILIZER_EDIT_FORM_NAME, name, value));
};

// Персистентность: сырое содержимое хранилища
export const readPersistence = (): { calculator: AppSnapshot } | null => {
  const raw = localStorage.getItem("reduxState");
  return raw ? (JSON.parse(raw) as { calculator: AppSnapshot }) : null;
};

// «Перезапуск» приложения: свежий экземпляр стора, читающий персистентность
export async function getFreshSnapshot(): Promise<AppSnapshot> {
  const { vi } = await import("vitest");
  vi.resetModules();
  const mod = (await import("@/redux")) as { store: { getState: () => unknown } };
  return (mod.store.getState() as unknown as RootState).calculator;
}

// Херметичный сброс: состояние к дефолтам (каждый тест независимо)
export const resetStore = (): void => {
  store.dispatch(reset(REDUX_FORM_NAME));
  store.dispatch(reset(FERTILIZER_EDIT_FORM_NAME));
  store.dispatch(
    loadStateSuccess({
      calculationForm: null,
      result: null,
      toppingUpResult: null,
      process: false,
      error: false,
      fertilizers: [...defaultFertilizers],
      recipes: [...DEFAULT_RECIPES],
    }),
  );
};
