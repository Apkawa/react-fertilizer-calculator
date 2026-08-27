import React from "react";
import { createFormWrapper } from "@/test-utils/form";
import { renderApp } from "@/test-utils/render";
import { Radio } from "./Radio";

const FormWrapper = createFormWrapper("smoke_radio");

// Смоук: радио-кнопка рендерится внутри redux-form формы.
test("components/ui/ReduxForm/Radio smoke: радио рендерится в форме", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Radio name="test_radio" value="a" label="Тестовый радио" />
    </FormWrapper>,
  );
  expect(container.textContent).toContain("Тестовый радио");
  expect(container.querySelector("input[type=radio]")).not.toBeNull();
}, 15000);
