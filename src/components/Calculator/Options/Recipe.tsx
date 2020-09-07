import React, {FunctionComponent} from "react";
import {Button, Card, Flex} from "rebass";
import {getRecipeFieldName, RecipeElementForm} from "./RecipeElementForm";
import {Elements} from "../../../calculator/fertilizer";
import {useFormValues} from "../../../hooks/ReduxForm";
import {FERTILIZER_ELEMENT_NAMES} from "../../../calculator/constants";

export const DEFAULT_RECIPES = [
  {
    name: "Вега",
    color: 'green',
    elements: {
      N: 220,
      P: 50,
      K: 200,
      Ca: 170,
      Mg: 50,
    }
  },
  {
    name: "Цвет",
    color: 'yellow',
    elements: {
      N: 150,
      P: 90,
      K: 280,
      Ca: 170,
      Mg: 50,
    }
  },
  {
    name: "Плод",
    color: 'red',
    elements: {
      N: 140,
      P: 50,
      K: 330,
      Ca: 170,
      Mg: 50,
    }
  }
]

interface RecipeProps {
}

export const Recipe: FunctionComponent<RecipeProps> = () => {
  const [_, setValue] = useFormValues()

  const setRecipe = (elements: Elements) => {
    for (let [name, value] of Object.entries(elements)) {
      setValue(getRecipeFieldName(name), value)
    }
  }
  const resetRecipe = () => {
    let zeroValues = Object.fromEntries(FERTILIZER_ELEMENT_NAMES.map(el => [el, 0])) as unknown as Elements
    setRecipe(zeroValues)
  }
  return (
    <Card>
      <Flex flexDirection="column">
        <Flex
          justifyContent="center"
        >
          {DEFAULT_RECIPES.map(({name, color, elements}) =>
            <Button
              type="button"
              marginRight={2}
              bg={color}
              color={'black'}
              onClick={() => setRecipe(elements)}
            >{name}</Button>
          )}
          <Button
            type="button"
            onClick={resetRecipe}
          >X</Button>
        </Flex>
        <Flex justifyContent="space-between">
          {
            FERTILIZER_ELEMENT_NAMES.map(n => <RecipeElementForm name={n}/>)
          }
        </Flex>
      </Flex>
    </Card>
  )
}
