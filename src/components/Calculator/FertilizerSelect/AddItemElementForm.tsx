import React, {FunctionComponent, useEffect, useState} from "react";
import {Flex} from "rebass";
import {Input} from "@rebass/forms";

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
    const v = parseInt(value)
    setValue(v)
    props.onChange && props.onChange(v)
  }

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" width='4rem'>
      <label style={{textAlign: 'center'}}>
        {name}
      </label>
      <Input
        maxLength={2}
        pattern="^\d+$"
        autoComplete="off"
        width="3rem"
        value={value.toString()}
        disabled={disabled}
        onChange={event => onChange(event.target.value)}
        style={{
          textAlign: "center"
        }}
      />
    </Flex>
  )
}
