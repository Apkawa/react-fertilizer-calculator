import React from "react";

import {Label, Radio as RebassRadio, RadioProps as RebassRadioProps} from "@rebass/forms";
import {Field as ReduxField} from "redux-form";
import {ReduxFormComponentType, WrapperInputType} from "./types";

interface RadioProps extends RebassRadioProps {
  label: string,
  value: string | number,
}

const WrappedCheckbox: WrapperInputType<RadioProps> = ({input, label, value, ...props}: any) =>
  <Label>
    <RebassRadio
      {...props}
      {...input}
    />
    {label}
  </Label>

// TODO вывести тип
export const Radio: ReduxFormComponentType<RadioProps> = ({
                                                            name,
                                                            value,
                                                            normalize= (v) => v.toString(),
                                                            ...props
                                                          }) => {
  return (
    <ReduxField
      component={WrappedCheckbox}
      name={name}
      normalize={normalize}
      // onClick={() => setChecked(!checked)}
      // checked={checked}
      type='radio'
      value={normalize(value)}
      {...props as any}
    />
  )
}
