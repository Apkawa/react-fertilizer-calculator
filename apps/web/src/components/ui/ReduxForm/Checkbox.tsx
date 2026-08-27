import {
  Label,
  Checkbox as RebassCheckbox,
  type CheckboxProps as RebassCheckboxProps,
} from "@rebass/forms";
import React from "react";
import { Field as ReduxField } from "redux-form";
import type { ReduxFormComponentType, WrapperInputType } from "./types";

interface CheckboxProps extends RebassCheckboxProps {
  label: string;
}

const WrappedCheckbox: WrapperInputType<CheckboxProps> = ({ input, label, ...props }: any) => (
  <Label>
    <RebassCheckbox {...props} {...input} checked={input.value} />
    {label}
  </Label>
);

// TODO вывести тип
export const Checkbox: ReduxFormComponentType<CheckboxProps> = ({ name, ...props }) => {
  return <ReduxField component={WrappedCheckbox} name={name} {...(props as any)} />;
};
