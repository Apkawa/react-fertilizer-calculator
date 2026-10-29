import {
  type NumberInputChangeEvent,
  NumberInput as UiNumberInput,
  type NumberInputProps as UiNumberInputProps,
} from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
import { useFormField } from "@/store/use-form-field";
import { type LegacyLayout, layoutStyle } from "./Input";

export interface NumberInputProps
  extends Omit<UiNumberInputProps, "onChange" | "width">,
    Omit<LegacyLayout, "maxWidth"> {
  /** Dot-path поля внутри текущей формы (FormProvider) */
  name: string;
  /** Преобразование значения при записи (аналог normalize redux-form) */
  normalize?: (value: string) => string | number;
  label?: string;
}

// Контролируемое числовое поле со спиннером: value из глобального стора,
// запись через FormProvider — та же «гигаформа», что у Input. maxWidth
// остаётся пропом UiNumberInput (он сам кладёт его в стиль поля).
export const NumberInput: FunctionComponent<NumberInputProps> = ({
  name,
  normalize,
  label,
  width,
  flex,
  marginRight,
  style,
  // Явный aria-label от коньюмера — в приоритете над label-пропом
  "aria-label": ariaLabel,
  ...props
}) => {
  const { value, setValue } = useFormField(name);
  const handleChange = (e: NumberInputChangeEvent) => {
    // значение из поля — строка, из кнопки спиннера — число
    const raw = String(e.target.value);
    setValue(name, normalize ? normalize(raw) : raw);
  };
  return (
    <UiNumberInput
      {...props}
      name={name}
      value={(value ?? "") as string | number}
      onChange={handleChange}
      aria-label={ariaLabel ?? label}
      style={layoutStyle({ width, flex, marginRight, style })}
    />
  );
};
