import React, { type ChangeEvent, type FunctionComponent } from "react";
import { useFormField } from "@/store/use-form-field";
import { Input as RebassInput, type InputProps as RebassInputProps } from "../RebassWidgets";

export interface InputProps extends RebassInputProps {
  /** Dot-path поля внутри текущей формы (FormProvider) */
  name: string;
  /** Преобразование значения при записи (аналог normalize redux-form) */
  normalize?: (value: string) => string | number;
  label?: string;
}

// «Сырой» ребасс-инпут (для компонентов, не являющихся полями формы)
export const StyledInput = RebassInput;

// Контролируемое текстовое/числовое поле: value из глобального стора, запись через FormProvider
export const Input: FunctionComponent<InputProps> = ({ name, normalize, label, ...props }) => {
  const { value, setValue } = useFormField(name);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setValue(name, normalize ? normalize(raw) : raw);
  };
  return (
    <RebassInput
      // biome-ignore lint/suspicious/noExplicitAny: styled(RebassInput) конфликтует по пропсу `css`
      {...(props as any)}
      value={(value ?? "") as string | number}
      onChange={handleChange}
      lang="en-US"
      placeholder={props.placeholder || label}
    />
  );
};
