import React, {FunctionComponent} from "react";
import {Flex} from "rebass";
import {Input} from "@/components/ui/ReduxForm/Input";
import {decimal} from "@/components/ui/ReduxForm/normalizers";
import {NPKOxides} from "@/calculator/fertilizer";
import {Elements} from "@/calculator/types";

interface RecipeElementFormProps {
  name: keyof Elements,
  disabled?: boolean
}


export const AddItemElementForm: FunctionComponent<RecipeElementFormProps> = (props) => {
  const {name, disabled} = props
  let displayName: string = name;
  if (NPKOxides.hasOwnProperty(name)) {
    displayName = NPKOxides[name] as string
  }
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" width='4rem'>
      <label style={{textAlign: 'center'}}>
        {displayName}
      </label>
      <Input
        name={'npk.' + name}
        type="number"
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
