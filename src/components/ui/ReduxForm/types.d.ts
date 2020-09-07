import {ComponentType, FunctionComponent} from "react";
import {
  BaseFieldProps,
  InjectedArrayProps,
  InjectedFormProps,
  WrappedFieldArrayProps,
  WrappedFieldInputProps
} from "redux-form";
import {CalculatorFormValues} from "../../Calculator/types";

export type WrapperInputType<T> = FunctionComponent<T & WrappedFieldInputProps>

export type ReduxFormComponentType<T> = ComponentType<T & Partial<BaseFieldProps>>
export type ReduxFormType<Props, Data={}> = ComponentType<Props & InjectedFormProps<Data>>

export type ReduxFieldArrayType<Props, Data={}> = ComponentType<Props & WrappedFieldArrayProps<Data>>
