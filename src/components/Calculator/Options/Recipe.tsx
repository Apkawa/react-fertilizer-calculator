import React, {FunctionComponent} from "react";
import {Button, Card, Flex} from "rebass";
import {RecipeElementForm} from "./RecipeElementForm";
import {ELEMENT_NAMES} from "../constants";


interface RecipeProps {
}

export const Recipe: FunctionComponent<RecipeProps> = () => {
  return (
    <Card>
      <Flex flexDirection="column">
        <Flex
          justifyContent="center"
        >
          <Button>Вега</Button>
          <Button>Цвет</Button>
          <Button>Плод</Button>
          <Button>X</Button>
        </Flex>
        <Flex justifyContent="space-between">
          {
            ELEMENT_NAMES.map(n => <RecipeElementForm name={n}/>)
          }
        </Flex>
      </Flex>
    </Card>
  )
}
