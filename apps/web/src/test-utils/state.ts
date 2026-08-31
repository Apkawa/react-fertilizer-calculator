/**
 * Тестовый шов: доступ к состоянию приложения без привязки к конкретной стеку.
 * Поведенческие тесты (__tests__/*.behavior.test.tsx) зависят только от этого модуля.
 *
 * Реализация на zustand (`@/store`): тот же набор функций, что при redux +
 * redux-form + saga, но обращения идут к zustand-стору.
 */

import type { ExportStateType } from "@fertilizer/calculator/format/types";
import type { FertilizerInfo } from "@fertilizer/calculator/types";
import type { AddEditFormType } from "@/components/Calculator/FertilizerManager/types";
import type { CalculatorState } from "@/components/Calculator/types";
import { createAppStore, useStore } from "@/store";
import { PERSIST_KEY } from "@/store/persistence";

// Снимок части состояния, которую проверяют поведенческие тесты
export type AppSnapshot = CalculatorState;

export const getState = (): AppSnapshot => useStore.getState().calculator;

// Поле формы расчета (dot-path)
export const setFormField = (name: string, value: unknown): void => {
  useStore.getState().setFieldValue(name, value);
};

// Запуск расчета (минуя валидацию формы)
export const calculateNow = (): void => {
  useStore.getState().calculate();
};

// Менеджер удобрений
export const pushFertilizer = (f: FertilizerInfo): void => {
  useStore.getState().pushFertilizer(f);
};

export const setFertilizers = (list: FertilizerInfo[]): void => {
  useStore.getState().setFertilizers(list);
};

export const resetFertilizers = (): void => {
  useStore.getState().resetFertilizers();
};

// Импорт состояния
export const importState = (payload: ExportStateType): void => {
  useStore.getState().importState(payload);
};

// Сообщение об ошибке выбора удобрений (top-level в zustand-сторе)
export const getFertilizersError = (): string | undefined =>
  useStore.getState().fertilizersError ?? undefined;

// Форма редактирования удобрения
export const getFertilizerEditForm = (): AddEditFormType => useStore.getState().fertilizerEdit;

export const setFertilizerEditField = (name: string, value: unknown): void => {
  useStore.getState().setFertilizerEditField(name, value);
};

// Персистентность: сырое содержимое хранилища (zustand пишет под ключ `appState`)
export const readPersistence = (): { calculator: AppSnapshot } | null => {
  const raw = localStorage.getItem(PERSIST_KEY);
  return raw ? (JSON.parse(raw) as { calculator: AppSnapshot }) : null;
};

// «Перезапуск» приложения: свежий экземпляр стора, читающий персистентность
export async function getFreshSnapshot(): Promise<AppSnapshot> {
  return createAppStore().getState().calculator;
}

// Херметичный сброс: состояние к дефолтам (каждый тест независимо)
export const resetStore = (): void => {
  useStore.getState().reset();
};
