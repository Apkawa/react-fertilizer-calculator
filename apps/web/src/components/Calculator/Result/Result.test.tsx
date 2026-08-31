import { within } from "@testing-library/react";
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

// a11y (stage 2): кнопки результата адресуются по доступному имени
// («Отправить на миксер» — иконка + подпись, «Сохранить комплекс» —
// появляется после расчета, дефолт стора — без результата).
test("components/Calculator/Result: кнопки имеют доступные имена", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Result />
    </FormWrapper>,
  );
  expect(within(container).getByRole("button", { name: "Отправить на миксер" })).not.toBeNull();
  // Сохранение комплекса — только когда есть результат (дефолт стора: null)
  expect(within(container).queryByRole("button", { name: "Сохранить комплекс" })).toBeNull();
}, 15000);
