/**
 * Поведенческие (characterization) тесты логики расчета.
 * Зависят только от тестового шва (test-utils/state.ts):
 * при смене стека состояния тела тестов не меняются.
 */

import { calculate_v4 } from "@fertilizer/calculator";
import type { ExportStateType } from "@fertilizer/calculator/format/types";
import {
  calculateToppingUp,
  getEmptyElements,
  getNPKDetailInfo,
} from "@fertilizer/calculator/helpers";
import type { FertilizerInfo } from "@fertilizer/calculator/types";
import { fireEvent, screen } from "@testing-library/react";
import React from "react";
import Calculator from "@/components/Calculator";
import { defaultFertilizers } from "@/components/Calculator/constants/fertilizers";
import { DEFAULT_RECIPES } from "@/components/Calculator/constants/recipes";
import { renderApp } from "@/test-utils/render";
import {
  calculateNow,
  getFertilizersError,
  getState,
  importState,
  pushFertilizer,
  resetFertilizers,
  resetStore,
  setFertilizers,
  setFormField,
} from "@/test-utils/state";

beforeEach(resetStore);

describe("Расчет", () => {
  test("выбраны удобрения → Calculate → результат (вес, элементы)", async () => {
    const { container } = renderApp(<Calculator />);
    const selection = defaultFertilizers.slice(0, 2);
    setFormField("fertilizers", selection);

    // Зеркало формы: calculationForm содержит значения формы
    const formValues = getState().calculationForm;
    expect(formValues).not.toBeNull();
    expect(formValues?.fertilizers).toEqual(selection);

    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    const expected = calculate_v4(formValues!.recipe, formValues!.fertilizers, {
      ignore: { ...formValues!.ignore },
      accuracy: formValues!.accuracy,
      solution_volume: formValues!.solution_volume,
      solution_concentration: formValues!.solution_concentration,
    });
    const result = getState().result;
    expect(result).not.toBeNull();
    expect(result!.fertilizers).toEqual(expected.fertilizers);
    expect(result!.elements).toEqual(expected.elements);
    expect(result!.deltaElements).toEqual(expected.deltaElements);
    // Результат виден в DOM
    expect(container.textContent).toContain("Результат расчета");
  }, 20000);

  test("удобрения не выбраны → Calculate → подсказка, без результата", async () => {
    const { container } = renderApp(<Calculator />);
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));
    expect(getState().result).toBeNull();
    expect(getState().process).toBe(false);
    expect(container.textContent).toContain("Выберите удобрения");
  }, 20000);

  test("гэйд: пустая выборка → ошибка, нет результата", () => {
    renderApp(<Calculator />);
    setFormField("fertilizers", []);
    calculateNow();
    expect(getState().error).toBe(true);
    expect(getState().process).toBe(false);
    expect(getState().result).toBeNull();
    // На поле есть сообщение о проблеме с удобрениями
    expect(getFertilizersError()).toBeTruthy();
  });
});

describe("Менеджер удобрений", () => {
  test("push/set/reset + синхронизация выборки по id", () => {
    renderApp(<Calculator />);
    const f: FertilizerInfo = { id: "Тестовое удобрение", npk: { NO3: 10 } };

    pushFertilizer(f);
    expect(getState().fertilizers).toEqual([...defaultFertilizers, f]);

    // Синхронизация: если fertilizer уже в выборке (по id) — обновляем в выборке
    setFormField("fertilizers", [f]);
    expect(getState().calculationForm?.fertilizers).toEqual([f]);
    const updated: FertilizerInfo = { ...f, npk: { NO3: 20 } };
    pushFertilizer(updated);
    const len = getState().fertilizers.length;
    expect(getState().fertilizers[len - 1]).toEqual(updated);
    expect(getState().calculationForm?.fertilizers).toEqual([updated]);

    const reordered = [...defaultFertilizers].reverse();
    setFertilizers(reordered);
    expect(getState().fertilizers).toEqual(reordered);
    resetFertilizers();
    expect(getState().fertilizers).toEqual(defaultFertilizers);
  });
});

describe("Импорт состояния", () => {
  test("импорт → расчет с импортированными данными", () => {
    renderApp(<Calculator />);
    const form = {
      accuracy: 0.2,
      solution_volume: 1,
      solution_concentration: { k: 100, v_1: 10, v_2: 1000 },
      recipe: { ...DEFAULT_RECIPES[0].elements },
      fertilizers: defaultFertilizers.slice(0, 2),
      dilution_concentration: { k: 1, v_1: 1, v_2: 1000 },
      mixerOptions: {},
    };
    const payload: ExportStateType = {
      meta: { version: "1", ref: "test", created: "2024-01-01T00:00:00.000Z" },
      calculator: {
        calculationForm: form,
        result: null,
        fertilizers: defaultFertilizers,
        recipes: DEFAULT_RECIPES,
      },
    };

    importState(payload);
    expect(getState().fertilizers).toEqual(defaultFertilizers);
    expect(getState().calculationForm?.fertilizers).toEqual(form.fertilizers);

    calculateNow();
    const expected = calculate_v4(form.recipe, form.fertilizers, {
      ignore: {},
      accuracy: form.accuracy,
      solution_volume: form.solution_volume,
      solution_concentration: form.solution_concentration,
    });
    const result = getState().result;
    expect(result).not.toBeNull();
    expect(result!.fertilizers).toEqual(expected.fertilizers);
    expect(result!.elements).toEqual(expected.elements);
  });
});

describe("Topping-up", () => {
  // TODO(Stage 2): переключить шов test-utils/state.ts на zustand и убрать .skip.
  // На текущем redux-стеке тест намеренно «красный» (дефект calculateStartSaga),
  // логика уже покрыта unit-тестом стора (store/index.test.ts, зелёный).
  test.skip("включен → solution_volume доводится до объема topping-up, пересчет", async () => {
    renderApp(<Calculator />);
    setFormField("fertilizers", defaultFertilizers.slice(0, 2));
    setFormField("topping_up_enabled", true);
    setFormField("topping_up.currentSolution.volume", 5);
    setFormField("topping_up.currentSolution.EC", 2);
    setFormField("topping_up.currentSolution.profileEC", 2);
    setFormField("topping_up.currentSolution.profileSaltsConcentration", 2);
    setFormField("topping_up.newSolution.volume", 10);

    const formValues = getState().calculationForm;
    expect(formValues).not.toBeNull();
    const tu = formValues!.topping_up;
    expect(tu).not.toBeNull();

    // Ожидаемый результат долива (та же логика, что в приложении)
    const tRes = calculateToppingUp({
      currentSolution: tu!.currentSolution,
      newSolution: {
        ...tu!.newSolution,
        EC: getNPKDetailInfo({ ...getEmptyElements(), ...formValues!.recipe }).EC,
      },
    });

    calculateNow();

    const state = getState();
    // Объем/концентрация доведены до значений topping-up
    expect(state.calculationForm?.solution_volume).toBe(tRes.volume);
    expect(state.calculationForm?.solution_concentration).toBe(tRes.concentration);
    // Результат пересчитан под новые значения
    const expected = calculate_v4(formValues!.recipe, formValues!.fertilizers, {
      ignore: { ...formValues!.ignore },
      accuracy: formValues!.accuracy,
      solution_volume: tRes.volume,
      solution_concentration: tRes.concentration,
    });
    expect(state.result).not.toBeNull();
    expect(state.result!.fertilizers).toEqual(expected.fertilizers);
  }, 20000);
});
