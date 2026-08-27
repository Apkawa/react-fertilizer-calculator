import React from "react";
import { REDUX_FORM_NAME } from "@/components/Calculator/constants";
import { createFormWrapper } from "@/test-utils/form";
import { renderApp } from "@/test-utils/render";
import FertilizerSelect from "./index";

const FormWrapper = createFormWrapper(REDUX_FORM_NAME);

// Смоук: выбор удобрений (FieldArray) рендерится внутри формы.
// Пустой выбор невалиден → подсказка «Выберите удобрения» (meta.error).
test("components/Calculator/FertilizerSelect smoke: выбор удобрений рендерится", () => {
  const { container } = renderApp(
    <FormWrapper>
      <FertilizerSelect />
    </FormWrapper>,
  );
  expect(container.textContent).toContain("Выберите удобрения");
}, 15000);
