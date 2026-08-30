import { FERTILIZER_ELEMENT_NAMES, MACRO_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { getEmptyElements, getNPKDetailInfo } from "@fertilizer/calculator/helpers";
import type { Elements, NeedElements } from "@fertilizer/calculator/types";
import { IconButton } from "@fertilizer/icons";
import { Card, Dropdown, Heading, Modal, Text } from "@fertilizer/ui";
import React, { type FunctionComponent, useState } from "react";
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
    <div className="m-1 flex flex-col items-center" title={title || undefined}>
      <Heading className="text-sm">{props.name}</Heading>
      <Text>{props.value}</Text>
    </div>
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
      <div className="flex flex-col">
        <div className="flex">
          <div className="mx-2 flex-1">
            <Dropdown<RecipeType>
              value={selected}
              items={recipes}
              label="Рецепт"
              onChange={onChangeHandler}
              onEdit={onEditHandler}
              renderItem={({ item }) => (
                <div className="flex flex-1 justify-between">
                  <div className="w-4" style={{ backgroundColor: item.color || "gray" }}></div>
                  <div className="mx-2 flex-1">{item.name}</div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveItemHandler(item);
                    }}
                  >
                    -
                  </button>
                </div>
              )}
              renderValue={(item) => item?.name || ""}
            />
          </div>
          <div>
            <IconButton
              marginRight={1}
              name="save"
              aria-label="Сохранить рецепт"
              onClick={onAddHandler}
            />
            <IconButton name="broom" aria-label="Сбросить рецепт" onClick={resetRecipe} />
          </div>
        </div>
        <div className="flex justify-between">
          {MACRO_ELEMENT_NAMES.map((n) => (
            <RecipeElementForm key={n} name={n} />
          ))}
        </div>
        <div className="flex justify-around">
          <Modal
            title="Настройка профиля"
            button={({ modal }) => (
              <IconButton
                marginRight={1}
                name="tune"
                aria-label="Настройки рецепта"
                onClick={modal.open}
              />
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
        </div>
      </div>
    </Card>
  );
};
