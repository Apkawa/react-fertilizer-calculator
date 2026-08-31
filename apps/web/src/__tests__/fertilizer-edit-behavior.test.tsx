/**
 * Поведенный тест формы редактирования удобрения:
 * при смене состава (composition + composition_enable) поле npk пересчитывается автоматически.
 * Зависит только от тестового шва (test-utils/state.ts).
 */

import { normalizeFertilizer } from "@fertilizer/calculator/fertilizer";
import React from "react";
import { AddEdit, getInitialValues } from "@/components/Calculator/FertilizerManager/AddEdit";
import { renderApp } from "@/test-utils/render";
import { getFertilizerEditForm, resetStore, setFertilizerEditField } from "@/test-utils/state";

beforeEach(resetStore);

describe("Форма удобрения", () => {
  test("состав → npk пересчитывается автоматически", () => {
    renderApp(<AddEdit initialValues={getInitialValues({ id: "" })} />);

    const composition = [{ formula: "NH4NO3", percent: 100 }];
    setFertilizerEditField("composition", composition);
    setFertilizerEditField("composition_enable", true);

    // Та же функция нормализации, что и в приложении
    const expected = normalizeFertilizer({ id: "", composition }, true).elements;
    expect(getFertilizerEditForm().npk).toEqual(expected);
  });
});
