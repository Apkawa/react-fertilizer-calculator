import { Label, Radio as UiRadio, type RadioProps as UiRadioProps } from "@fertilizer/ui";
import React, { type ChangeEvent, type FunctionComponent } from "react";
import { useFormField } from "@/store/use-form-field";

export interface RadioProps extends Omit<UiRadioProps, "name" | "value" | "checked"> {
  /** Dot-path поля (общее для группы радио) внутри текущей формы */
  name: string;
  /** Значение конкретного радио */
  value: string | number;
  label: string;
  /** Преобразование значения при записи (аналог normalize redux-form) */
  normalize?: (value: string) => string | number;
}

// Контролируемое радио: выбранное значение из глобального стора, запись через FormProvider
export const Radio: FunctionComponent<RadioProps> = ({
  name,
  value: radioValue,
  label,
  normalize,
  ...props
}) => {
  const { value, setValue } = useFormField(name);
  const normalizeValue = (v: string | number) => (normalize ? normalize(v as string) : v);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setValue(name, normalizeValue(radioValue));
    }
  };
  return (
    <Label>
      <UiRadio
        {...props}
        name={name}
        value={radioValue}
        checked={value === normalizeValue(radioValue)}
        onChange={handleChange}
      />
      {label}
    </Label>
  );
};
