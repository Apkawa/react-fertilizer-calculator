import React, { type ReactNode } from "react";
import { Form, reduxForm } from "redux-form";
import type { ReduxFormType } from "@/components/ui/ReduxForm/types";

interface TestFormProps {
  // children — опционально: HOC reduxForm() не пропускает обязательные
  // own-пропсы через свою типизацию, но сам children форвардит.
  children?: ReactNode;
}

const TestForm: ReduxFormType<TestFormProps, {}> = ({ children }) => (
  <Form onSubmit={() => undefined}>{children}</Form>
);

/**
 * Создаёт обёртку для смок-тестов: компонент, декорированный reduxForm()
 * (с именем формы), внутри которого рендерится <Form>.
 *
 * Компоненты redux-form (Field/FieldArray/Form) берут контекст _reduxForm
 * из компонента, декорированного reduxForm(), — та же структура, что и
 * в реальном приложении (CalculatorContainer рендерит <Form> внутри себя).
 */
export function createFormWrapper(formName: string) {
  // initialValues обязателен: redux-form регистрирует форму в сторе
  // (initialize) только при его наличии, а компоненты внутри (например
  // Result) читают getFormValues(...) с первого рендера.
  return reduxForm({ form: formName, initialValues: {} })(TestForm);
}
