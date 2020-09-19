import React, {FunctionComponent} from "react";
import {Box, Flex} from "rebass";
import {Input} from "@/components/ui/ReduxForm/Input";
import {number} from "@/components/ui/ReduxForm/normalizers";

interface RecipeElementFormProps {
  name: string
}

export const getRecipeFieldName = (name: string) => `recipe.${name}`



export const RecipeElementForm: FunctionComponent<RecipeElementFormProps> = ({name}) => {
  return (
    <Flex flexDirection="column"
          justifyContent="center"
          alignItems="center"
          maxWidth='3rem'
    >
      <Box style={{textAlign: 'center'}}
      >
        {name}
      </Box>
      <Input
        name={getRecipeFieldName(name)}
        type="number"
        step="1"
        min="0"
        max="999"
        autoComplete="off"
        normalize={number}
        maxWidth="3rem"
        style={{
          textAlign: "center"
        }}
      />
    </Flex>
  )
}
