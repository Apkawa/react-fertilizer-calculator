import React, {ComponentType} from "react";
import {WrappedFieldProps} from "redux-form";


// TODO вывести тип
export function renderReduxField
  (WrappedComponent: ComponentType<any>){
  return (props: WrappedFieldProps) => {
    return (
      <WrappedComponent {...props.input}/>
    )
  }
}

