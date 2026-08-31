import {
  Label,
  Checkbox as UiCheckbox,
  type CheckboxProps as UiCheckboxProps,
} from "@fertilizer/ui";
import React, { type ChangeEvent, type FunctionComponent } from "react";
import { useFormField } from "@/store/use-form-field";

export interface CheckboxProps extends Omit<UiCheckboxProps, "name"> {
  /** Dot-path поля внутри текущей формы (FormProvider) */
  name: string;
  label: string;
}

// Контролируемый checkbox: значение (boolean) из глобального стора, запись через FormProvider
export const Checkbox: FunctionComponent<CheckboxProps> = ({ name, label, ...props }) => {
  const { value, setValue } = useFormField(name);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setValue(name, e.target.checked);
  return (
    <Label>
      <UiCheckbox {...props} checked={Boolean(value)} onChange={handleChange} />
      {label}
    </Label>
  );
};
