import React, {ComponentType, useState} from "react";

import {Checkbox as RebassCheckbox, CheckboxProps as RebassCheckboxProps, Label} from "@rebass/forms";
import {Field as ReduxField} from "redux-form";
import {ReduxFormComponentType, WrapperInputType} from "./types";

interface CheckboxProps extends RebassCheckboxProps {
  label: string
}

const WrappedCheckbox: WrapperInputType<CheckboxProps> = ({input, label, ...props}: any) =>
  <Label>
    <RebassCheckbox
      {...props} {...input}
    />
    {label}
  </Label>

// TODO вывести тип
export const Checkbox: ReduxFormComponentType<CheckboxProps> = ({name, ...props}) => {
  return (
    <ReduxField
      component={WrappedCheckbox}
      name={name}
      {...props as any}
    />
  )
}

