import {
  Label,
  Checkbox as RebassCheckbox,
  type CheckboxProps as RebassCheckboxProps,
} from "@rebass/forms";
import React, { type ChangeEvent, type FunctionComponent } from "react";
import { useFormField } from "@/store/use-form-field";

export interface CheckboxProps extends Omit<RebassCheckboxProps, "name"> {
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
      {/* biome-ignore lint/suspicious/noExplicitAny: styled(RebassCheckbox) конфликтует по пропсу `css` */}
      <RebassCheckbox {...(props as any)} checked={Boolean(value)} onChange={handleChange} />
      {label}
    </Label>
  );
};
