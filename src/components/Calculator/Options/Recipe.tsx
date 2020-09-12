import React, {FunctionComponent, useState} from "react";
import {Box, Card, Flex} from "rebass";
import {Broom} from '@styled-icons/fa-solid/Broom'
import {Save} from '@styled-icons/boxicons-regular/Save'
import {getRecipeFieldName, RecipeElementForm} from "./RecipeElementForm";
import {Elements} from "@/calculator/fertilizer";
import {useFormValues} from "@/hooks/ReduxForm";
import {FERTILIZER_ELEMENT_NAMES} from "@/calculator/constants";

import {IconButton} from "@/components/ui/IconButton";
import {Dropdown} from "@/components/ui/Dropdown/Dropdown";
import {CalculatorState, Recipe as RecipeType} from "@/components/Calculator/types";
import {useDispatch, useSelector} from "react-redux";
import {recipePush, recipeRemove} from "@/components/Calculator/actions";

interface RecipeProps {
}

export const Recipe: FunctionComponent<RecipeProps> = () => {
  const {
    recipes = [],
  } = useSelector<any>(state => state.calculator) as CalculatorState

  const [values, setValue] = useFormValues()
  const [selected, setSelected] = useState<RecipeType | undefined>(recipes?.[0])
  const [creating, setCreating] = useState(false)

  const dispatch = useDispatch()


  const onChangeHandler = (item: RecipeType | null) => {
    item && setSelected(item)
    item && setRecipe(item.elements)
    setCreating(false)
  }

  const setRecipe = (elements: Elements) => {
    for (let [name, value] of Object.entries(elements)) {
      setValue(getRecipeFieldName(name), value)
    }
  }
  const resetRecipe = () => {
    let zeroValues = Object.fromEntries(FERTILIZER_ELEMENT_NAMES.map(el => [el, 0])) as unknown as Elements

    setRecipe(zeroValues)
  }
  const onEditHandler = (value: string) => {
    let zeroValues = Object.fromEntries(FERTILIZER_ELEMENT_NAMES.map(el => [el, 0])) as unknown as Elements
    setSelected({name: value, elements: zeroValues})
    setRecipe(zeroValues)
    setCreating(true)
  }
  const onAddHandler = () => {
    if (!selected) {
      return
    }
    const recipe = {name: selected.name, elements: values.recipe}
    if (creating) {

      dispatch(recipePush(recipe))
    }
    setCreating(false)
  }
  const onRemoveItemHandler = (item: RecipeType) => {
    dispatch(recipeRemove(item))
  }
  return (
    <Card>
      <Flex flexDirection="column">
        <Flex
        >
          <Box flex={1} mx={2}>
            <Dropdown<RecipeType>
              value={selected}
              items={recipes}
              onChange={onChangeHandler}
              onEdit={onEditHandler}
              renderItem={({item}) => (
                <Flex flex={1} justifyContent="space-between">
                  <Box width={3} backgroundColor={item.color || 'gray'}>
                  </Box>
                  <Box flex={1} mx={2}>
                    {item.name}
                  </Box>
                  <button onClick={event => {
                    event.stopPropagation()
                    onRemoveItemHandler(item)
                  }}>-
                  </button>
                </Flex>
              )}
              renderValue={item => item?.name || ""}
            />
          </Box>
          <Box>
            <IconButton
              marginRight={1}
              component={Save}
              disabled={!creating}
              onClick={onAddHandler}
            />
            <IconButton
              component={Broom}
              onClick={resetRecipe}
            />
          </Box>
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
