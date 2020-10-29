import React from "react";
import {Field as ReduxField} from "redux-form";

import {Input as RebassInput, InputProps as RebassInputProps} from "@rebass/forms";
import {ReduxFormComponentType, WrapperInputType} from "./types";
import styled from "styled-components";

interface InputProps extends RebassInputProps {
  label?: string
}

export const StyledInput = styled(RebassInput)`
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

export const WrappedInput: WrapperInputType<InputProps> = ({input, label, type = "text", ...props}: any) =>
  <StyledInput  {...props}
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
