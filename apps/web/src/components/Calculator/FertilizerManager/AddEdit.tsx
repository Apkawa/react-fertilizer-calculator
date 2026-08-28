import { MACRO_ELEMENT_NAMES, MICRO_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { normalizeFertilizer } from "@fertilizer/calculator/fertilizer";
import { Label } from "@rebass/forms";
import React, { type FunctionComponent, useEffect } from "react";
import { Box, Flex, Text } from "rebass";
import type { FertilizerInfo } from "@/components/Calculator/types";
import { Checkbox, decimal, Input, number } from "@/components/ui/Form";
import { useStore } from "@/store";
import { FormProvider } from "@/store/form-context";
import { AddEditCompositionList } from "./AddEditCompositionList";
import { AddEditNPKString } from "./AddEditNPKString";
import { AddItemElementForm } from "./AddItemElementForm";
import { FERTILIZER_EDIT_FORM_NAME } from "./constants";
import type { AddEditFormType } from "./types";

interface AddEditProps {
  fertilizer?: FertilizerInfo;
  /** Легаси-поле (initialValues HOC redux-form) — оставлено для совместимости (Result, тесты) */
  initialValues?: AddEditFormType;
}

export const getElements = (f: FertilizerInfo) => {
  return normalizeFertilizer(f, false).elements;
};

export function getInitialValues(f: FertilizerInfo): AddEditFormType {
  const formData: AddEditFormType = { ...f };

  if (f.composition) {
    formData.npk = normalizeFertilizer(f, false).elements;
    formData.composition_enable = true;
  }
  if (f.solution_concentration) {
    formData.solution_concentration = f.solution_concentration;
    formData.solution_density = f.solution_density || 1000;
    formData.solution_density_enable = true;
  }
  return formData;
}

export function formToFertilizer(formValues: AddEditFormType): FertilizerInfo {
  const {
    composition_enable,
    composition,
    npk,
    solution_density_enable,
    solution_density,
    solution_concentration,
    ..._f
  } = formValues;
  const f: FertilizerInfo = _f;
  if (composition_enable) {
    f.composition = composition;
  } else {
    f.npk = npk;
  }
  if (solution_density_enable) {
    f.solution_density = solution_density;
    f.solution_concentration = solution_concentration;
  }
  return f;
}

// Форма добавления/редактирования удобрения (zustand): сама предоставляет
// FormProvider (fertilizerEdit) — поля читают/пишут глобальный стор.
// Инициализация формы при монтировании заменяет initialValues + enableReinitialize redux-form.
export const AddEdit: FunctionComponent<AddEditProps> = (props) => {
  const { fertilizer, initialValues } = props;
  const formValues = useStore((s) => s.fertilizerEdit);

  // Переинициализация формы при смене удобрения/исходной формы
  // (аналог initialValues + enableReinitialize redux-form)
  useEffect(() => {
    useStore
      .getState()
      .setFertilizerEdit(getInitialValues(fertilizer ?? initialValues ?? { id: "" }));
  }, [fertilizer, initialValues]);

  return (
    <FormProvider formName={FERTILIZER_EDIT_FORM_NAME}>
      <form>
        <Flex flexDirection="column">
          <Input name="id" title="Name" label="Name" />
          <Box>Макроэлементы</Box>
          <Flex>
            {MACRO_ELEMENT_NAMES.map((el) => (
              <AddItemElementForm key={el} name={el} disabled={formValues.composition_enable} />
            ))}
          </Flex>
          <Box>Микроэлементы</Box>
          <Flex>
            {MICRO_ELEMENT_NAMES.map((el) => (
              <AddItemElementForm key={el} name={el} disabled={formValues.composition_enable} />
            ))}
          </Flex>
          <Flex>
            <AddEditNPKString
              npk={formValues.npk}
              onChange={(npk) => {
                useStore.getState().setFertilizerEditField("npk", npk);
              }}
            />
          </Flex>

          <Flex>
            <Checkbox name="composition_enable" label="Формула" />
          </Flex>
          {formValues.composition_enable ? (
            <Flex>
              <AddEditCompositionList />
            </Flex>
          ) : null}
          <Flex alignItems="center">
            <Box width="auto" marginRight={2}>
              <Checkbox name="solution_density_enable" label="Раствор" />
            </Box>
            {formValues.solution_density_enable ? (
              <Flex flexDirection="column">
                <Flex alignItems="flex-end">
                  <Label flexDirection="column">
                    Концентрация
                    <Input
                      name="solution_concentration"
                      type="number"
                      step="0.1"
                      min="0"
                      max="3000"
                      normalize={decimal}
                      width="5em"
                      marginRight={2}
                    />
                    <Text sx={{ whiteSpace: "nowrap" }}>г/л</Text>
                  </Label>
                </Flex>
                <Flex alignItems="flex-end">
                  <Label flexDirection="column">
                    Плотность
                    <Input
                      name="solution_density"
                      type="number"
                      step="1"
                      min="800"
                      max="3000"
                      normalize={number}
                      width="5em"
                      marginRight={2}
                    />
                  </Label>
                  <Text sx={{ whiteSpace: "nowrap" }}>г/л</Text>
                </Flex>
              </Flex>
            ) : null}
          </Flex>
          <Flex>
            <Label flexDirection="column">
              Миксер, номер помпы
              <Input
                name="pump_number"
                type="number"
                step="1"
                min="1"
                max="16"
                required={false}
                normalize={number}
                maxWidth={"3em"}
              />
            </Label>
          </Flex>
        </Flex>
      </form>
    </FormProvider>
  );
};
