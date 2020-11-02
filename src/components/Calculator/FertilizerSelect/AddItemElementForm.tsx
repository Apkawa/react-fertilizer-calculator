import React, {FunctionComponent, useEffect, useState} from "react";
import {Flex} from "rebass";
import {StyledInput} from "@/components/ui/ReduxForm/Input";

interface RecipeElementFormProps {
  name: string,
  value: number,
  disabled?: boolean,
  onChange?: (value: number) => void
}




export const AddItemElementForm: FunctionComponent<RecipeElementFormProps> = (props) => {
  const {name, disabled} = props
  const [value, setValue] = useState(props.value)

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  const onChange = (value: string) => {
    const v = parseFloat(value)
    setValue(v)
  }

  const onBlur = () => {
    props.onChange && props.onChange(value)
  }

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" width='4rem'>
      <label style={{textAlign: 'center'}}>
        {name}
      </label>
      <StyledInput
        type="number"
        step="0.1"
        min="0"
        max="100"
        autoComplete="off"
        width="3rem"
        value={value.toString()}
        disabled={disabled}
        onChange={event => onChange(event.target.value)}
        onBlur={onBlur}
        style={{
          textAlign: "center"
        }}
      />
    </Flex>
  )
}
