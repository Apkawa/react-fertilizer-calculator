import { DefaultRootState } from "react-redux";
import { FormState } from "redux-form";
import { CalculatorState } from "../components/Calculator/types";

export interface RootState extends DefaultRootState {
  calculator?: CalculatorState;
  form?: FormState;
}
