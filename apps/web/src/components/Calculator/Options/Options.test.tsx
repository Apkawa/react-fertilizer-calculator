import { within } from "@testing-library/react";
import React from "react";
import { REDUX_FORM_NAME } from "@/components/Calculator/constants";
import { createFormWrapper } from "@/test-utils/form";
import { renderApp } from "@/test-utils/render";
import { Options } from "./Options";

const FormWrapper = createFormWrapper(REDUX_FORM_NAME);

// Смоук: блок опций рендерится внутри redux-form формы
// (поля Solution/ToppingUp/Dilution требуют контекста Form).
test("components/Calculator/Options smoke: опции рендерятся в форме", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Options />
    </FormWrapper>,
  );
  expect(container.textContent).toContain("Calculate");
}, 15000);

// Смоук (Stage 6A): layout канон макета (guideline §3.4/§3.6) — колонка карточек
// с единым зазором, кнопка расчёта — канон Button (data-ui="button", на всю ширину);
// строки карточек: подпись слева / поле справа (w-24/w-28, text-right);
// чекбоксы/радио — канон атомы @fertilizer/ui (ряд-подпись даёт touch-цель ≥40px).
test("components/Calculator/Options smoke: строки label-left/input-right и атомы канона", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Options />
    </FormWrapper>,
  );
  // Колонка карточек — flex-колонка с gap-2 (канон content column §2.2)
  expect(container.firstElementChild?.className).toContain("flex-col");
  expect(container.firstElementChild?.className).toContain("gap-2");
  // Кнопка расчёта — канон Button (хук data-ui) на всю ширину
  const calculate = within(container).getByRole("button", { name: "Calculate" });
  expect(calculate.getAttribute("data-ui")).toBe("button");
  expect(calculate.className).toContain("w-full");
  // Строки «подпись слева / поле справа»: поля с фиксированной шириной и text-right
  const rows = container.querySelectorAll(".justify-between");
  expect(rows.length).toBeGreaterThan(0);
  const volumeInputs = within(container).getAllByLabelText("Объем, л");
  expect(volumeInputs.length).toBeGreaterThan(0);
  for (const el of volumeInputs) {
    expect(el.className).toContain("w-24");
    expect(el.className).toContain("text-right");
  }
  // Чекбоксы/радио — канон атомы (hooks data-ui на нативных контролах)
  expect(container.querySelectorAll('[data-ui="checkbox"]').length).toBeGreaterThanOrEqual(5);
  expect(container.querySelectorAll('[data-ui="radio"]').length).toBe(4);
}, 15000);
