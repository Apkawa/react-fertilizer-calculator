import React from "react";
import { createFormWrapper } from "@/test-utils/form";
import { renderApp } from "@/test-utils/render";
import { Checkbox } from "./Checkbox";

const FormWrapper = createFormWrapper("smoke_checkbox");

// Смоук: чекбокс рендерится внутри redux-form формы.
test("components/ui/ReduxForm/Checkbox smoke: чекбокс рендерится в форме", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Checkbox name="test_check" label="Тестовый чекбокс" />
    </FormWrapper>,
  );
  expect(container.textContent).toContain("Тестовый чекбокс");
  expect(container.querySelector("input[type=checkbox]")).not.toBeNull();
}, 15000);
