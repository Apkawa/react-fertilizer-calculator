import React, {ChangeEvent, useState} from "react";
import {Box, Button, Flex} from "rebass";

import {useFormName, useFormValues} from "@/hooks/ReduxForm";
import {CalculatorFormValues} from "@/components/Calculator/types";
import {getNPKDetailInfo} from '@/calculator/helpers';
import {Elements, NeedElements} from "@/calculator/types";
import {decimal} from "@/components/ui/ReduxForm/normalizers";
import {FERTILIZER_ELEMENT_NAMES, MACRO_ELEMENT_NAMES, MICRO_ELEMENT_NAMES} from "@/calculator/constants";
import {NumberInput as StyledInput} from "@/components/ui/RebassWidgets/Number";
import {
  ALLOWED_ELEMENT_IN_MATRIX, calculateEC,
  convertProfileWithEC,
  convertProfileWithRatio,
  fixIonicBalanceByCa, fixIonicBalanceByS, getProfileRatioMatrix
} from "@/calculator/profile";
import {StyledBalanceCell} from "@/components/Calculator/Options/Recipe";
import {round} from "@/utils";
import {ModalActions} from "@/components/ui/Modal/Modal";

interface RecipeTuneFormProps {
  modal: ModalActions,
  onSave: (npk: NeedElements) => void
}

const ELEMENT_IN_MATRIX = ALLOWED_ELEMENT_IN_MATRIX.filter(el => !["NH4", "NO3"].includes(el))

const IMPORTANT_CELLS = ['K:N', 'K:Ca', 'K:Mg', "NH4:NO3", "P", "Cl", "EC"]
const BLOCKING_CELLS = ["N:Ca", "Ca:N", "Ca:K", "Ca:Mg", "Mg:K", "Mg:Ca"]

export function RecipeTuneForm(props: RecipeTuneFormProps) {
  const formValue = useFormValues<CalculatorFormValues>(useFormName())[0]
  const [recipe, setRecipe] = useState(formValue.recipe)
  const recipeInfo = getNPKDetailInfo(recipe as Elements)
  const [ratio, setRatio] = useState(recipeInfo.ratio)
  const [EC, setEC] = useState(recipeInfo.EC)

  const onChangeRecipe = (el: FERTILIZER_ELEMENT_NAMES, value: number) => {
    let newRecipe = {...recipe, [el]: value}
    if (el === 'S') {
      newRecipe.Ca = fixIonicBalanceByCa(newRecipe)
    } else {
      newRecipe.S = fixIonicBalanceByS(newRecipe)
    }
    setRecipe(newRecipe)
    setEC(calculateEC(newRecipe))
    setRatio(getProfileRatioMatrix(newRecipe))
  }

  const onChangeEC = (val: number) => {
    let newRecipe = convertProfileWithEC(recipe as Elements, val)
    setRecipe(newRecipe)
    setEC(calculateEC(newRecipe))
    setRatio(getProfileRatioMatrix(newRecipe))
  }
  const onChangeRatio = (El1: ALLOWED_ELEMENT_IN_MATRIX, El2: ALLOWED_ELEMENT_IN_MATRIX, val: number) => {
    if (val) {
      let newNpk = convertProfileWithRatio(recipe, {[El1]: {[El2]: val}})
      newNpk = convertProfileWithEC(newNpk, EC)
      setRecipe(newNpk)
      setEC(calculateEC(newNpk))
      setRatio(getProfileRatioMatrix(newNpk))
    } else {
      setRatio({...ratio, [El1]: {...ratio[El1], [El2]: val}})
    }
  }

  const onSaveHandler = () => {
    props.onSave(recipe)
    props.modal.close()
  }
  return (
    <Flex flexDirection={'column'}>
      <Flex>
        {MACRO_ELEMENT_NAMES.map(el => (
          <RecipeInput
            name={el}
            label={el}
            value={recipe[el]}
            onChange={val => onChangeRecipe(el, val)}
            step={0.1}
          />
        ))}
        <RecipeInput name={'EC'} label={"EC"} value={EC} onChange={onChangeEC}/>
      </Flex>
      <Flex justifyContent="space-around">
        <StyledBalanceCell name="ΔΣ I" value={recipeInfo.ion_balance}/>
        <StyledBalanceCell name="EC" value={recipeInfo.EC}/>
        <RecipeInput
          name={'NH4:NO3'}
          label={"%NH4"}
          value={round(ratio.NH4.NO3 * 100, 1)}
          step={0.1}
          onChange={v => onChangeRatio('NH4', 'NO3', v / 100)}
        />
        <StyledBalanceCell name="K:N" value={recipeInfo.ratio.Ca.N}/>
        <StyledBalanceCell name="K:Ca" value={recipeInfo.ratio.K.Ca}/>
        <StyledBalanceCell name="K:Mg" value={recipeInfo.ratio.K.Mg}/>
      </Flex>
      <Flex>
        <table>
          <thead>
          <tr>
            <th></th>
            {ELEMENT_IN_MATRIX.map(el => <th>{el}</th>)}
          </tr>
          </thead>
          <tbody>
          {ELEMENT_IN_MATRIX.map(el => (
            <tr>
              <th>{el}</th>
              {ELEMENT_IN_MATRIX.map(el2 => (
                <td style={{textAlign: 'center'}}>
                  {el === el2 ? 1 : (
                    <RecipeInput
                      name={`${el2}:${el}`}
                      value={round(ratio?.[el2]?.[el] || 0, 2)}
                      onChange={value => onChangeRatio(el2, el, value)}
                    />
                  )}
                </td>
              ))}

            </tr>

          ))}
          </tbody>
        </table>
      </Flex>
      <Flex justifyContent="space-around">
        {MICRO_ELEMENT_NAMES.map(el => (
          <RecipeInput
            name={el}
            label={el}
            value={(recipe[el] || 0) * 1000}
            onChange={val => onChangeRecipe(el, val / 1000)}
            step={1}
          />
        ))}
      </Flex>
      <Flex justifyContent="space-between">
        <Button type="button" onClick={props.modal.close}>Cancel</Button>
        <Button type="button" onClick={onSaveHandler}>Save</Button>
      </Flex>
    </Flex>
  )
}

interface RecipeInputProps {
  name: string,
  label?: string,
  onChange?: (value: number) => void,
  value?: number,
  step?: number,
}


function RecipeInput(props: RecipeInputProps) {
  const {
    name, label, onChange,
    value = 0,
    step = 0.01
  } = props

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const val = decimal(e.target.value)
      onChange && onChange(val)
    }
  }

  return (
    <Flex flexDirection="column"
          justifyContent="center"
          alignItems="center"
          maxWidth='6rem'
    >
      {label ?
        <Box style={{textAlign: 'center'}}>
          {label}
        </Box>
        : null
      }
      <StyledInput
        onChange={onChangeHandler}
        name={name}
        value={value}
        type="number"
        step={step.toString()}
        min="0"
        max="9999"
        autoComplete="off"
        maxWidth="6rem"
        lang="en-US"
        style={{
          textAlign: "center",
          backgroundColor: IMPORTANT_CELLS.includes(name) ? "#b3f7b8" : undefined,
          color: BLOCKING_CELLS.includes(name) ? "red" : undefined,
          borderColor: "black",
        }}
      />
    </Flex>
  )
}
