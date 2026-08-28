import React, { type ReactNode } from "react";
import { FormProvider } from "@/store/form-context";

interface TestFormProps {
  children?: ReactNode;
}

const TestForm: React.FunctionComponent<TestFormProps> = ({ children }) => <>{children}</>;

/**
 * Создаёт обёртку для смок-тестов: `<FormProvider formName>` — контекст
 * имени формы, внутри которого рендерятся поля (ui/Form Input/Checkbox/Radio).
 *
 * Та же структура, что и в реальном приложении: корень (Calculator)
 * предоставляет "calculatorOptions", AddEdit — "fertilizerEdit",
 * MixerForm — "mixerOptions". Состояние — в zustand-сторе.
 */
export function createFormWrapper(formName: string) {
  return ({ children }: TestFormProps) => (
    <FormProvider formName={formName}>{children}</FormProvider>
  );
}
