import React, {FunctionComponent} from "react";
import {Flex} from "rebass";
import {Input} from "../../ui/ReduxForm/Input";
import {number} from "../../ui/ReduxForm/normalizers";

interface RecipeElementFormProps {
  name: string
}

export const getRecipeFieldName = (name: string) => `recipe.${name}`



export const RecipeElementForm: FunctionComponent<RecipeElementFormProps> = ({name}) => {
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" width='4rem'>
      <label style={{textAlign: 'center'}}>
        {name}
      </label>
      <Input
        name={getRecipeFieldName(name)}
        maxLength={3}
        pattern="^\d+$"
        autoComplete="off"
        normalize={number}
        width="3rem"
        style={{
          textAlign: "center"
        }}
      />
    </Flex>
  )
}
