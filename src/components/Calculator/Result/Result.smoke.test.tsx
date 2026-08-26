import React from "react";
import { REDUX_FORM_NAME } from "@/components/Calculator/constants";
import { createFormWrapper } from "@/test-utils/form";
import { renderApp } from "@/test-utils/render";
import { Result } from "./Result";

const FormWrapper = createFormWrapper(REDUX_FORM_NAME);

// Смоук: блок результата рендерится. Имя формы — настоящее:
// Result деструктуризует getFormValues(REDUX_FORM_NAME) и падает
// без зарегистрированной формы.
test("components/Calculator/Result smoke: блок результата рендерится", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Result />
    </FormWrapper>,
  );
  expect(container.textContent).toContain("Результат расчета");
}, 15000);
