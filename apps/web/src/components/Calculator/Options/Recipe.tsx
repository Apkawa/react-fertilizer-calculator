import { Save } from "@styled-icons/boxicons-regular/Save";
import { Broom } from "@styled-icons/fa-solid/Broom";
import { Tune } from "@styled-icons/material-sharp/Tune";
import React, { type FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, Flex, Heading, Text } from "rebass";
import { FERTILIZER_ELEMENT_NAMES, MACRO_ELEMENT_NAMES } from "@/calculator/constants";
import { getEmptyElements, getNPKDetailInfo } from "@/calculator/helpers";
import type { Elements, NeedElements } from "@/calculator/types";
import { recipePush, recipeRemove } from "@/components/Calculator/actions";
import { DEFAULT_MICRO_RECIPE } from "@/components/Calculator/constants/recipes";
import {
  getOptimalRatioDisplay,
  RecipeTuneForm,
} from "@/components/Calculator/Options/RecipeTuneForm";
import type { CalculatorState, Recipe as RecipeType } from "@/components/Calculator/types";
import { Dropdown } from "@/components/ui/Dropdown/Dropdown";
import { IconButton } from "@/components/ui/IconButton";
import { Modal } from "@/components/ui/Modal/Modal";
import { useFormName, useFormValues } from "@/hooks/ReduxForm";
import { round } from "@/utils";
import { getRecipeFieldName, RecipeElementForm } from "./RecipeElementForm";

interface StyledBalanceCellProps {
  name: string;
  value: number | string;
  title?: string;
}

export const StyledBalanceCell: FunctionComponent<StyledBalanceCellProps> = (props) => {
  const ratio = getOptimalRatioDisplay(props.name);
  const title = `${props.title || ""} ${ratio || ""}`.trim();

  return (
    <Flex flexDirection="column" m={1} title={title || undefined} alignItems="center">
      <Heading fontSize={1}>{props.name}</Heading>
      <Text>{props.value}</Text>
    </Flex>
  );
};

type RecipeProps = {};

export const Recipe: FunctionComponent<RecipeProps> = () => {
  const { recipes = [] } = useSelector<any>((state) => state.calculator) as CalculatorState;

  const [values, setValue] = useFormValues<{ recipe: Elements }>(useFormName());
  const [selected, setSelected] = useState<RecipeType | undefined>(recipes?.[0]);

  const dispatch = useDispatch();

  const NPKBalance = getNPKDetailInfo(values.recipe || getEmptyElements());

  const onChangeHandler = (item: RecipeType | null) => {
    item && setSelected(item);
    item && setRecipe({ ...DEFAULT_MICRO_RECIPE, ...item.elements });
  };

  const setRecipe = (elements: NeedElements) => {
    for (const [name, value] of Object.entries(elements)) {
      setValue(getRecipeFieldName(name), value);
    }
  };
  const resetRecipe = () => {
    const zeroValues = Object.fromEntries(
      FERTILIZER_ELEMENT_NAMES.map((el) => [el, 0]),
    ) as unknown as Elements;
    setRecipe(zeroValues);
  };
  const onEditHandler = (value: string) => {
    const zeroValues = Object.fromEntries(
      FERTILIZER_ELEMENT_NAMES.map((el) => [el, selected?.elements[el] || 0]),
    ) as unknown as Elements;
    setSelected({ name: value, elements: zeroValues });
  };

  const onAddHandler = () => {
    if (!selected) {
      return;
    }
    const recipe = { ...selected, elements: values.recipe };
    dispatch(recipePush(recipe));
  };
  const onRemoveItemHandler = (item: RecipeType) => {
    dispatch(recipeRemove(item));
  };
  return (
    <Card>
      <Flex flexDirection="column">
        <Flex>
          <Box flex={1} mx={2}>
            <Dropdown<RecipeType>
              value={selected}
              items={recipes}
              onChange={onChangeHandler}
              onEdit={onEditHandler}
              renderItem={({ item }) => (
                <Flex flex={1} justifyContent="space-between">
                  <Box width={3} backgroundColor={item.color || "gray"}></Box>
                  <Box flex={1} mx={2}>
                    {item.name}
                  </Box>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveItemHandler(item);
                    }}
                  >
                    -
                  </button>
                </Flex>
              )}
              renderValue={(item) => item?.name || ""}
            />
          </Box>
          <Box>
            <IconButton marginRight={1} component={Save} onClick={onAddHandler} />
            <IconButton component={Broom} onClick={resetRecipe} />
          </Box>
        </Flex>
        <Flex justifyContent="space-between">
          {MACRO_ELEMENT_NAMES.map((n) => (
            <RecipeElementForm key={n} name={n} />
          ))}
        </Flex>
        <Flex justifyContent="space-around">
          <Modal
            title="Настройка профиля"
            button={({ modal }) => (
              <IconButton marginRight={1} component={Tune} onClick={modal.open} />
            )}
            container={({ modal }) => (
              <>
                <RecipeTuneForm modal={modal} onSave={setRecipe} />
              </>
            )}
          />
          <StyledBalanceCell
            name="ΔΣ I"
            value={NPKBalance.ion_balance}
            title={"Ионный баланс, дб == 0±5%"}
          />
          <StyledBalanceCell name="EC" value={NPKBalance.EC} />
          <StyledBalanceCell name="%NH4" value={round(NPKBalance.ratio.NH4.NO3 * 100, 1)} />
          <StyledBalanceCell name="K:N" value={NPKBalance.ratio.K.N} />
          <StyledBalanceCell name="K:Ca" value={NPKBalance.ratio.K.Ca} />
          <StyledBalanceCell name="K:Mg" value={NPKBalance.ratio.K.Mg} />
        </Flex>
      </Flex>
    </Card>
  );
};
