import React, { type ComponentType } from "react";
import type { WrappedFieldProps } from "redux-form";

// TODO вывести тип
export function renderReduxField(WrappedComponent: ComponentType<any>) {
  return (props: WrappedFieldProps) => {
    return <WrappedComponent {...props.input} />;
  };
}
