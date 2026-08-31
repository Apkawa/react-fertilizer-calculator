import React, { createContext, type FunctionComponent, type ReactNode, useContext } from "react";
import { REDUX_FORM_NAME } from "@/components/Calculator/constants";
import { useStore } from "./index";

interface FormContextValue {
  formName: string;
  setValue: (path: string, value: unknown) => void;
}

const FormContext = createContext<FormContextValue | null>(null);

// Контекст формы: имя формы + запись значения (аналог ReduxFormContext redux-form)
export function useFormContext(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext: контекст формы не предоставлен");
  return ctx;
}

// Провайдер контекста формы (обёртка над zustand-стором, аналог HOC reduxForm)
export const FormProvider: FunctionComponent<{ formName: string; children: ReactNode }> = ({
  formName,
  children,
}) => {
  const setValue = (path: string, value: unknown) => {
    const s = useStore.getState();
    if (formName === REDUX_FORM_NAME) s.setFieldValue(path, value);
    else if (formName === "fertilizerEdit") s.setFertilizerEditField(path, value);
    else if (formName === "mixerOptions") s.setMixerField(path, value);
  };
  return <FormContext.Provider value={{ formName, setValue }}>{children}</FormContext.Provider>;
};
