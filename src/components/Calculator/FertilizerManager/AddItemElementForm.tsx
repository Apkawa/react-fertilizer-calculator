import React, {FunctionComponent} from "react";
import {Flex} from "rebass";
import {Input} from "@/components/ui/ReduxForm/Input";
import {decimal} from "@/components/ui/ReduxForm/normalizers";

interface RecipeElementFormProps {
  name: string,
  disabled?: boolean
}




export const AddItemElementForm: FunctionComponent<RecipeElementFormProps> = (props) => {
  const {name, disabled} = props

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" width='4rem'>
      <label style={{textAlign: 'center'}}>
        {name}
      </label>
      <Input
        name={'npk.' + name}
        type="number"
        step="0.1"
        min="0"
        max="100"
        autoComplete="off"
        width="3rem"
        style={{
          textAlign: "center"
        }}
        normalize={decimal}
        disabled={disabled}
      />
    </Flex>
  )
}
