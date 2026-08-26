import { Label, Radio as RebassRadio, type RadioProps as RebassRadioProps } from "@rebass/forms";
import React from "react";
import { Field as ReduxField } from "redux-form";
import type { ReduxFormComponentType, WrapperInputType } from "./types";

interface RadioProps extends RebassRadioProps {
  label: string;
  value: string | number;
}

const WrappedCheckbox: WrapperInputType<RadioProps> = ({ input, label, value, ...props }: any) => (
  <Label>
    <RebassRadio {...props} {...input} />
    {label}
  </Label>
);

// TODO вывести тип
export const Radio: ReduxFormComponentType<RadioProps> = ({
  name,
  value,
  normalize = (v) => v.toString(),
  ...props
}) => {
  return (
    <ReduxField
      component={WrappedCheckbox}
      name={name}
      normalize={normalize}
      // onClick={() => setChecked(!checked)}
      // checked={checked}
      type="radio"
      value={normalize(value)}
      {...(props as any)}
    />
  );
};
