import React from "react";
import { REDUX_FORM_NAME } from "@/components/Calculator/constants";
import { createFormWrapper } from "@/test-utils/form";
import { renderApp } from "@/test-utils/render";
import FertilizerSelect from "./index";

const FormWrapper = createFormWrapper(REDUX_FORM_NAME);

// Смоук: выбор удобрений (контроллируемый список на zustand) рендерится
// внутри формы. Дропдаун выбора — `<input>` со значением первого
// fertilizer из дефолтного набора (значение — атрибут value, не textContent).
// Ошибка «Выберите удобрения» (store.fertilizersError) появляется после
// Calculate — покрыто поведенческим тестом (calculator-behavior).
test("components/Calculator/FertilizerSelect smoke: выбор удобрений рендерится", () => {
  const { container } = renderApp(
    <FormWrapper>
      <FertilizerSelect />
    </FormWrapper>,
  );
  const input = container.querySelector("input") as HTMLInputElement | null;
  expect(input?.value).toContain("Сульфат магния");
}, 15000);
