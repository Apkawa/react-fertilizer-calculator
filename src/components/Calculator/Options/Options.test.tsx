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
