import React from "react";
import {Field as ReduxField} from "redux-form";

import {Input as RebassInput, InputProps as RebassInputProps} from "@rebass/forms";
import {ReduxFormComponentType, WrapperInputType} from "./types";

interface InputProps extends RebassInputProps {
}

const WrappedInput: WrapperInputType<InputProps> = ({input, label, type = "text", ...props}: any) =>
  <RebassInput  {...props} {...input} type={type} placeholder={label}/>


// TODO вывести тип
export const Input: ReduxFormComponentType<InputProps> = ({name, ...props}) => {

  return (
    <ReduxField
      component={WrappedInput}
      name={name}
      {...props as any}
    />
  )
}
