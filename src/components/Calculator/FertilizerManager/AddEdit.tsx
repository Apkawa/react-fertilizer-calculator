import React from "react";
import {Box, Flex, Text} from "rebass";

import {FieldArray, Form, reduxForm} from 'redux-form'
import {ReduxFormType} from "@/components/ui/ReduxForm/types";
import {Input} from "@/components/ui/ReduxForm/Input";
import {normalizeFertilizer} from "@/calculator/fertilizer";
import {MACRO_ELEMENT_NAMES, MICRO_ELEMENT_NAMES} from "@/calculator/constants";

import {AddItemElementForm} from "./AddItemElementForm";

import {FERTILIZER_EDIT_FORM_NAME} from "./constants";
import {AddEditFormType} from "./types";
import {Checkbox} from "@/components/ui/ReduxForm/Checkbox";
import {AddEditCompositionList} from "@/components/Calculator/FertilizerManager/AddEditCompositionList";
import {useFormName, useFormValues} from "@/hooks/ReduxForm";
import {decimal, number} from "@/components/ui/ReduxForm/normalizers";
import {Label} from "@rebass/forms";
import {FertilizerInfo} from "@/components/Calculator/types";

interface AddEditProps {
  fertilizer?: FertilizerInfo,
}

export const getElements = (f: FertilizerInfo) => {
  return normalizeFertilizer(f, false).elements
}

export function getInitialValues(f: FertilizerInfo): AddEditFormType {
  let formData: AddEditFormType = {...f}

  if (f.composition) {
    formData.npk = normalizeFertilizer(f, false).elements
    formData.composition_enable = true
  }
  if (f.solution_concentration) {
    formData.solution_concentration = f.solution_concentration
    formData.solution_density = f.solution_density || 1000
    formData.solution_density_enable = true
  }
  return formData
}

export function formToFertilizer(formValues: AddEditFormType): FertilizerInfo {

  const {
    composition_enable, composition, npk,
    solution_density_enable, solution_density, solution_concentration,
    ..._f
  } = formValues
  const f: FertilizerInfo = _f
  if (composition_enable) {
    f.composition = composition
  } else {
    f.npk = npk
  }
  if (solution_density_enable) {
    f.solution_density = solution_density
    f.solution_concentration = solution_concentration
  }
  return f
}

const AddEditForm: ReduxFormType<AddEditProps, AddEditFormType> = (props) => {
  const formValues = useFormValues<AddEditFormType>(useFormName())[0]

  return (
    <Form>
      <Flex flexDirection='column'>
        <Input name="id" title="Name" label="Name"/>
        <Box>
          Макроэлементы
        </Box>
        <Flex>
          {MACRO_ELEMENT_NAMES.map(el => (
            <AddItemElementForm
              name={el}
              disabled={formValues.composition_enable}
            />
          ))}
        </Flex>
        <Box>
          Микроэлементы
        </Box>
        <Flex>
          {MICRO_ELEMENT_NAMES.map(el => (
            <AddItemElementForm
              name={el}
              disabled={formValues.composition_enable}
            />
          ))}
        </Flex>
        <Flex>
          <Checkbox name="composition_enable" label="Формула"/>
        </Flex>
        {formValues.composition_enable ?
          <Flex>
            <FieldArray<{}>
              name="composition"
              component={AddEditCompositionList}
            />
          </Flex> : null
        }
        <Flex alignItems='center'>
          <Box width="auto" marginRight={2}>
            <Checkbox
              name="solution_density_enable" label="Раствор"
            />
          </Box>
          {formValues.solution_density_enable ?
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
                    width='5em'
                    marginRight={2}
                  />
                  <Text sx={{whiteSpace: 'nowrap'}}>г/л</Text>
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
                    width='5em'
                    marginRight={2}
                  />
                </Label>
                <Text sx={{whiteSpace: 'nowrap'}}>г/л</Text>
              </Flex>
            </Flex>
            : null}
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
                maxWidth={'3em'}
              />
            </Label>
        </Flex>
      </Flex>
    </Form>
  )
}


export const AddEdit = reduxForm<AddEditFormType>({
  form: FERTILIZER_EDIT_FORM_NAME,
  enableReinitialize: true
})(AddEditForm)
