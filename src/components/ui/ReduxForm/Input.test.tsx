import React from "react";
import { createFormWrapper } from "@/test-utils/form";
import { renderApp } from "@/test-utils/render";
import { Input } from "./Input";

const FormWrapper = createFormWrapper("smoke_input");

// Смоук: поле ввода рендерится внутри redux-form формы.
test("components/ui/ReduxForm/Input smoke: поле рендерится в форме", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Input name="test_input" label="Тестовое поле" />
    </FormWrapper>,
  );
  const input = container.querySelector("input");
  expect(input).not.toBeNull();
  expect(input?.getAttribute("placeholder")).toBe("Тестовое поле");
}, 15000);
