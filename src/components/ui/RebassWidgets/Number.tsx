import React, {ChangeEvent, FC, useEffect, useRef, useState} from "react";
import {Input as RebassInput, InputProps as RebassInputProps} from "@rebass/forms";
import {Box, Flex} from "rebass";
import styled from "styled-components";
import FocusLock from 'react-focus-lock';

import {BlurAction} from "redux-form";
import {countDecimals, round} from "@/utils";

interface InputProps extends RebassInputProps {
}

interface Size {
  width: number,
  height: number
}


export const StyledInput = styled(RebassInput)`
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
    width: 0;
    height: 0;
  }
  -moz-appearance: textfield;
`


interface StyledSpinnerButtonProps extends Size {

}
const StyledSpinnerButton = styled.button<Partial<StyledSpinnerButtonProps>>`
  width: ${(props) => props.width}px;
  height: 3em;
  position: absolute;
  z-index: 30;
`


export const NumberInput: FC<InputProps> = (props: any) => {
  const step = parseFloat(props.step || 1)
  const precision = countDecimals(step)
  const [value, setValue] = useState(props.value)
  const [showBtn, setShowBtn] = useState(false)
  const [inputSize, setInputSize] = useState<Size | null>(null)
  const inputRef = useRef<HTMLInputElement>()
  const upButtonRef = useRef() as React.MutableRefObject<HTMLButtonElement>
  const downButtonRef = useRef() as React.MutableRefObject<HTMLButtonElement>

  const onFocusHandler = () => {
    setShowBtn(true)
  }
  const onBlurHandler = (e: FocusEvent) => {
    if (![upButtonRef?.current, downButtonRef?.current].includes(e.relatedTarget as any)) {
      setShowBtn(false)
    }
  }

  const onUpButtonHandler = () => {
    inputRef?.current?.focus()
    let v = round(value + step || 1, precision)
    setValue(v)
    props.onChange({target: {value: v}})
  }
  const onDownButtonHandler = () => {
    inputRef?.current?.focus()
    let v = round(value - step || 1, precision)
    setValue(v)
    props.onChange({target: {value: v}})
  }

  useEffect(() => {
    if (value != props.value) {
      setValue(props.value)
    }
  }, [props.value, value])


  useEffect(() => {
    setInputSize({
      width: inputRef?.current?.offsetWidth || 0,
      height: inputRef?.current?.offsetHeight || 0,
    })
  }, [inputRef])



  const offset = -(inputSize?.height || 0) + 5

  return (
    <Flex flexDirection="column" sx={{position: 'relative'}}>
      {showBtn ? <StyledSpinnerButton
        ref={upButtonRef}
        onClick={onUpButtonHandler}
        style={{top: `${offset}px`}}
        width={inputSize?.width}
      >^</StyledSpinnerButton> : null}
      <StyledInput
        ref={inputRef}
        {...props}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}

        lang="en-US"
        value={value}
      />
      {showBtn ? <StyledSpinnerButton
        ref={downButtonRef}
        onClick={onDownButtonHandler}
        style={{bottom: `${offset}px`}}
        width={inputSize?.width}
      >v</StyledSpinnerButton> : null}
    </Flex>
  )
}
