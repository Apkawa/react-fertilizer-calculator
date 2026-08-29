import { FERTILIZER_ELEMENT_NAMES, MACRO_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { getEmptyElements, getNPKDetailInfo } from "@fertilizer/calculator/helpers";
import type { Elements, NeedElements } from "@fertilizer/calculator/types";
import { IconButton } from "@fertilizer/icons";
import { Dropdown, Modal } from "@fertilizer/ui";
import React, { type FunctionComponent, useState } from "react";
import { Box, Card, Flex, Heading, Text } from "rebass";
import { DEFAULT_MICRO_RECIPE } from "@/components/Calculator/constants/recipes";
import {
  getOptimalRatioDisplay,
  RecipeTuneForm,
} from "@/components/Calculator/Options/RecipeTuneForm";
import type { Recipe as RecipeType } from "@/components/Calculator/types";
import { useStore } from "@/store";
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
  const { recipes = [] } = useStore((s) => s.calculator);
  const form = useStore((s) => s.calculator.calculationForm);

  const [selected, setSelected] = useState<RecipeType | undefined>(recipes?.[0]);

  const NPKBalance = getNPKDetailInfo((form?.recipe ?? getEmptyElements()) as Elements);

  const onChangeHandler = (item: RecipeType | null) => {
    item && setSelected(item);
    item && setRecipe({ ...DEFAULT_MICRO_RECIPE, ...item.elements });
  };

  const setRecipe = (elements: NeedElements) => {
    const { setFieldValue } = useStore.getState();
    for (const [name, value] of Object.entries(elements)) {
      setFieldValue(getRecipeFieldName(name), value);
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
    const recipe = { ...selected, elements: form?.recipe ?? {} };
    useStore.getState().pushRecipe(recipe);
  };
  const onRemoveItemHandler = (item: RecipeType) => {
    useStore.getState().removeRecipe(item);
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
            <IconButton marginRight={1} name="save" onClick={onAddHandler} />
            <IconButton name="broom" onClick={resetRecipe} />
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
            button={({ modal }) => <IconButton marginRight={1} name="tune" onClick={modal.open} />}
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
