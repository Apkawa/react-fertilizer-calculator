import React, {FunctionComponent, useState} from "react";
import {Box, Card, Flex, Heading, Text} from "rebass";
import {Broom} from '@styled-icons/fa-solid/Broom'
import {Save} from '@styled-icons/boxicons-regular/Save'
import {Tune} from '@styled-icons/material-sharp/Tune'
import {getRecipeFieldName, RecipeElementForm} from "./RecipeElementForm";
import {useFormName, useFormValues} from "@/hooks/ReduxForm";
import {FERTILIZER_ELEMENT_NAMES, MACRO_ELEMENT_NAMES} from "@/calculator/constants";

import {IconButton} from "@/components/ui/IconButton";
import {Dropdown} from "@/components/ui/Dropdown/Dropdown";
import {CalculatorState, Recipe as RecipeType} from "@/components/Calculator/types";
import {useDispatch, useSelector} from "react-redux";
import {recipePush, recipeRemove} from "@/components/Calculator/actions";
import {Elements, NeedElements} from "@/calculator/types";
import {getNPKDetailInfo, getEmptyElements} from "@/calculator/helpers";
import {Modal} from "@/components/ui/Modal/Modal";
import {RecipeTuneForm} from "@/components/Calculator/Options/RecipeTuneForm";
import {round} from "@/utils";
import {DEFAULT_MICRO_RECIPE} from "@/components/Calculator/constants/recipes";


export const StyledBalanceCell: FunctionComponent<{name:string, value: number}> = (props) => {
  return (
    <Flex flexDirection="column" m={1} alignItems="center">
      <Heading fontSize={1}>{props.name}</Heading>
      <Text>{props.value}</Text>
    </Flex>
  )
}

interface RecipeProps {
}

export const Recipe: FunctionComponent<RecipeProps> = () => {
  const {
    recipes = [],
  } = useSelector<any>(state => state.calculator) as CalculatorState

  const [values, setValue] = useFormValues(useFormName())
  const [selected, setSelected] = useState<RecipeType | undefined>(recipes?.[0])

  const dispatch = useDispatch()

  const NPKBalance = getNPKDetailInfo(values.recipe || getEmptyElements())

  const onChangeHandler = (item: RecipeType | null) => {
    item && setSelected(item)
    item && setRecipe({...DEFAULT_MICRO_RECIPE, ...item.elements})
  }

  const setRecipe = (elements: NeedElements) => {
    for (let [name, value] of Object.entries(elements)) {
      setValue(getRecipeFieldName(name), value)
    }
  }
  const resetRecipe = () => {
    let zeroValues = Object.fromEntries(FERTILIZER_ELEMENT_NAMES.map(el => [el, 0])) as unknown as Elements
    setRecipe(zeroValues)
  }
  const onEditHandler = (value: string) => {
    let zeroValues = Object.fromEntries(FERTILIZER_ELEMENT_NAMES
      .map(el => [el, selected?.elements[el] || 0])) as unknown as Elements
    setSelected({name: value, elements: zeroValues})
  }

  const onAddHandler = () => {
    if (!selected) {
      return
    }
    const recipe = {...selected, elements: values.recipe}
    dispatch(recipePush(recipe))
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
            MACRO_ELEMENT_NAMES.map(n => <RecipeElementForm name={n}/>)
          }
        </Flex>
        <Flex justifyContent="space-around">
          <Modal
            title="Настройка профиля"
            button={({modal}) => (
              <IconButton
              marginRight={1}
              component={Tune}
              onClick={modal.open}
              />
            )}
            container={({modal}) => (
              <>
                <RecipeTuneForm
                  modal={modal}
                  onSave={setRecipe}
                />
              </>
            )}
          />
          <StyledBalanceCell name="ΔΣ I" value={NPKBalance.ion_balance}/>
          <StyledBalanceCell name="EC" value={NPKBalance.EC}/>
          <StyledBalanceCell name="%NH4" value={round(NPKBalance.ratio.NH4.NO3 * 100, 1)}/>
          <StyledBalanceCell name="K:N" value={NPKBalance.ratio.K.N}/>
          <StyledBalanceCell name="K:Ca" value={NPKBalance.ratio.K.Ca}/>
          <StyledBalanceCell name="K:Mg" value={NPKBalance.ratio.K.Mg}/>
        </Flex>
      </Flex>
    </Card>
  )
}
