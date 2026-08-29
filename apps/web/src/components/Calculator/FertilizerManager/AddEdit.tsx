import { MACRO_ELEMENT_NAMES, MICRO_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { normalizeFertilizer } from "@fertilizer/calculator/fertilizer";
import { Label, Text } from "@fertilizer/ui";
import React, { type FunctionComponent, useEffect } from "react";
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
        <div className="flex flex-col">
          <Input name="id" title="Name" label="Name" />
          <div>Макроэлементы</div>
          <div className="flex">
            {MACRO_ELEMENT_NAMES.map((el) => (
              <AddItemElementForm key={el} name={el} disabled={formValues.composition_enable} />
            ))}
          </div>
          <div>Микроэлементы</div>
          <div className="flex">
            {MICRO_ELEMENT_NAMES.map((el) => (
              <AddItemElementForm key={el} name={el} disabled={formValues.composition_enable} />
            ))}
          </div>
          <div className="flex">
            <AddEditNPKString
              npk={formValues.npk}
              onChange={(npk) => {
                useStore.getState().setFertilizerEditField("npk", npk);
              }}
            />
          </div>

          <div className="flex">
            <Checkbox name="composition_enable" label="Формула" />
          </div>
          {formValues.composition_enable ? (
            <div className="flex">
              <AddEditCompositionList />
            </div>
          ) : null}
          <div className="flex items-center">
            <div className="w-auto mr-2">
              <Checkbox name="solution_density_enable" label="Раствор" />
            </div>
            {formValues.solution_density_enable ? (
              <div className="flex flex-col">
                <div className="flex items-end">
                  <Label className="flex flex-col">
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
                    <Text className="whitespace-nowrap">г/л</Text>
                  </Label>
                </div>
                <div className="flex items-end">
                  <Label className="flex flex-col">
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
                  <Text className="whitespace-nowrap">г/л</Text>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex">
            <Label className="flex flex-col">
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
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
