import { MACRO_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { getEmptyElements, getNPKDetailInfo } from "@fertilizer/calculator/helpers";
import type { Elements } from "@fertilizer/calculator/types";
import { fireEvent, within } from "@testing-library/react";
import React from "react";
import { REDUX_FORM_NAME } from "@/components/Calculator/constants";
import { useStore } from "@/store";
import { createFormWrapper } from "@/test-utils/form";
import { renderApp } from "@/test-utils/render";
import { round } from "@/utils";
import { Recipe } from "./Recipe";

const FormWrapper = createFormWrapper(REDUX_FORM_NAME);

// Round 6: дозы макро — NumberInput (не «голый» Input): по фокусу поля
// появляются кнопки спиннера ^/v внутри обёртки поля.
test("components/Calculator/Options/Recipe: доза макро — спиннер по фокусу", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Recipe />
    </FormWrapper>,
  );
  const input = within(container).getAllByLabelText(/Доза /)[0];
  expect(input.closest('[data-ui="number-input"]')).not.toBeNull();
  fireEvent.focus(input);
  const buttons = within(input.closest('[data-ui="number-input"]') as HTMLElement).getAllByRole(
    "button",
  );
  expect(buttons.map((b) => b.getAttribute("aria-label"))).toEqual(["увеличить", "уменьшить"]);
});

// Косметика (round 9): кнопки у select + тумблер баланса — icon-only
// IconButton по умолчанию квадратный (inline 2.5rem) и пара — в gap-2.
test("components/Calculator/Options/Recipe: кнопки у select и tune — квадрат по дефолту, пара в gap-2", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Recipe />
    </FormWrapper>,
  );
  const save = within(container).getByLabelText("Сохранить рецепт");
  const reset = within(container).getByLabelText("Сбросить рецепт");
  const tune = within(container).getByLabelText("Настройки рецепта");
  expect(save.style.width).toBe("2.5rem");
  expect(reset.style.width).toBe("2.5rem");
  expect(tune.style.width).toBe("2.5rem");
  expect(save.parentElement?.className).toContain("gap-2");
});

// Смоук (Stage 6A): дозы макро — grid канон макета (guideline §3.4/§2.1):
// <800px — 4 колонки × 2 ряда, ≥800px — 1 ряд × 8 колонок; в DOM всегда
// MACRO_ELEMENT_NAMES полей (8). Ассерты — по классам канона и по данным.
test("components/Calculator/Options/Recipe smoke: дозы рендерятся grid-канон с 8 полями", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Recipe />
    </FormWrapper>,
  );
  const doseInputs = within(container).getAllByLabelText(/Доза /);
  expect(doseInputs).toHaveLength(MACRO_ELEMENT_NAMES.length);
  const grid = container.querySelector(".grid");
  expect(grid?.className).toContain("grid-cols-4");
  expect(grid?.className).toContain("min-[800px]:grid-cols-8");
});

// Смоук (Stage 6A): ряд баланса Recipe — 6 чипов канона (@fertilizer/ui Chip,
// plain, data-ui="chip"): подпись сверху, значение снизу. Значения берём из
// getNPKDetailInfo по текущей форме стора — из данных приложения, не из
// литералов макета.
test("components/Calculator/Options/Recipe smoke: ряд баланса рендерит 6 чипов с данными профиля", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Recipe />
    </FormWrapper>,
  );
  const form = useStore.getState().calculator.calculationForm;
  const balance = getNPKDetailInfo((form?.recipe ?? getEmptyElements()) as Elements);
  const expected: Array<[string, number]> = [
    ["ΔΣ I", balance.ion_balance],
    ["EC", balance.EC],
    ["%NH4", round(balance.ratio.NH4.NO3 * 100, 1)],
    ["K:N", balance.ratio.K.N],
    ["K:Ca", balance.ratio.K.Ca],
    ["K:Mg", balance.ratio.K.Mg],
  ];
  const chips = container.querySelectorAll('[data-ui="chip"]');
  expect(chips).toHaveLength(expected.length);
  for (const [i, [label, value]] of expected.entries()) {
    const chip = chips[i];
    expect(chip.firstElementChild?.textContent, `подпись чипа ${i}`).toBe(label);
    expect(chip.lastElementChild?.textContent, `значение чипа ${i}`).toBe(String(value));
  }
});
