import {DefaultRootState} from "react-redux";
import {CalculatorState} from "../components/Calculator/types";
import {FormState} from 'redux-form'

export interface RootState
  extends
    DefaultRootState
{
  calculator?: CalculatorState,
  form?: FormState
}
