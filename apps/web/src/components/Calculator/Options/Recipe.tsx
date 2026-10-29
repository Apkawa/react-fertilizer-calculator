import { FERTILIZER_ELEMENT_NAMES, MACRO_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { getEmptyElements, getNPKDetailInfo } from "@fertilizer/calculator/helpers";
import type { Elements, NeedElements } from "@fertilizer/calculator/types";
import { IconButton } from "@fertilizer/icons";
import { Card, Chip, Heading, Modal, Text } from "@fertilizer/ui";
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
  const onAddHandler = () => {
    if (!selected) {
      return;
    }
    const recipe = { ...selected, elements: form?.recipe ?? {} };
    useStore.getState().pushRecipe(recipe);
  };
  return (
    <Card>
      <div className="flex flex-col">
        {/* Выбор рецепта — канон макета (index.html §3.1): нативный select
         * вместо Dropdown (merged-карточка «Удобрения» выводит дропдауны из
         * калькулятора; appearance: auto — нативный список). Подложка/рамка —
         * токены (литералов нет), touch-цель ≥40px как у поля (.input). */}
        <div className="flex items-center gap-2">
          <select
            className="min-h-[2.5rem] min-w-0 flex-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[0.875rem] text-[var(--text)]"
            aria-label="Рецепт"
            value={selected?.name ?? recipes[0]?.name ?? ""}
            onChange={(event) => {
              onChangeHandler(recipes.find((r) => r.name === event.target.value) ?? null);
            }}
          >
            {recipes.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
          {/* Кнопки у select — icon-only IconButton по умолчанию квадратный
           * (канон §3.1, round 9); пара — в flex-обёртке с gap-2 (§3.1). */}
          <div className="flex shrink-0 items-center gap-2">
            <IconButton name="save" aria-label="Сохранить рецепт" onClick={onAddHandler} />
            <IconButton name="broom" aria-label="Сбросить рецепт" onClick={resetRecipe} />
          </div>
        </div>
        {/* Дозы макро — канон макета (§3.4/§2.1): <800px — 4 колонки × 2 ряда,
         * ≥800px — 1 ряд × 8 колонок; количество полей — из MACRO_ELEMENT_NAMES */}
        <div className="mt-3 grid grid-cols-4 min-[800px]:grid-cols-8 gap-2">
          {MACRO_ELEMENT_NAMES.map((n) => (
            <RecipeElementForm key={n} name={n} />
          ))}
        </div>
        {/* Ряд баланса — чипы канона (§3.2): plain, flex-nowrap — всегда одна
         * строка; подписи точные («ΔΣ I» и т.д.), значения — из данных профиля
         * (getNPKDetailInfo). Chip title — тултип «Ионный баланс» на ΔΣ I. */}
        <div className="mt-3 flex flex-nowrap items-center gap-2">
          <Modal
            title="Настройка профиля"
            button={({ modal }) => (
              <IconButton name="tune" aria-label="Настройки рецепта" onClick={modal.open} />
            )}
            container={({ modal }) => (
              <>
                <RecipeTuneForm modal={modal} onSave={setRecipe} />
              </>
            )}
          />
          <Chip label="ΔΣ I" value={NPKBalance.ion_balance} title="Ионный баланс" />
          <Chip label="EC" value={NPKBalance.EC} />
          <Chip label="%NH4" value={round(NPKBalance.ratio.NH4.NO3 * 100, 1)} />
          <Chip label="K:N" value={NPKBalance.ratio.K.N} />
          <Chip label="K:Ca" value={NPKBalance.ratio.K.Ca} />
          <Chip label="K:Mg" value={NPKBalance.ratio.K.Mg} />
        </div>
      </div>
    </Card>
  );
};
