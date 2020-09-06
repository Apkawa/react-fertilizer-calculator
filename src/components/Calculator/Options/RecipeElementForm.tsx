import React, {FunctionComponent} from "react";
import {Input} from "@rebass/forms";
import {Flex} from "rebass";

interface RecipeElementFormProps {
  name: string
}

export const RecipeElementForm: FunctionComponent<RecipeElementFormProps> = ({name}) => {
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" width='4rem'>
      <label style={{textAlign: 'center'}}>
        {name}
      </label>
      <Input
        name={name} maxLength={4} pattern="/^\d+$/"
        width="3rem"
        style={{
          textAlign: "center"
        }}
      />
    </Flex>
  )
}
