import React from "react";
import {Field as ReduxField} from "redux-form";

import {Input as RebassInput, InputProps as RebassInputProps} from "../RebassWidgets";
import {ReduxFormComponentType, WrapperInputType} from "./types";

interface InputProps extends RebassInputProps {
  label?: string
}

export const StyledInput = RebassInput

export const WrappedInput: WrapperInputType<InputProps> = ({input, label, type = "text", ...props}: any) =>
  <RebassInput  {...props}
                {...input}
                type={type}
                lang="en-US"
                placeholder={label}
  />


// TODO вывести тип
export const Input: ReduxFormComponentType<InputProps> = (
  {
    name,
    ...props
  }) => {

  return (
    <ReduxField
      component={WrappedInput}
      name={name}
      {...props as any}
    />
  )
}
