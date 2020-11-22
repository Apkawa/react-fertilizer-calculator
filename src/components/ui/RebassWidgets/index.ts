import {Input as RebassInput, InputProps as RebassInputProps} from "@rebass/forms";
import styled from "styled-components";


export type InputProps = RebassInputProps

export const Input = styled(RebassInput)`
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
    width: 0;
    height: 0;
  }
  -moz-appearance: textfield;
`



