import React, {ChangeEvent, useState} from "react";
import {Box, Button, Flex} from "rebass";

import {useFormName, useFormValues} from "@/hooks/ReduxForm";
import {CalculatorFormValues} from "@/components/Calculator/types";
import {calculateNPKBalance} from '@/calculator/helpers';
import {Elements, NeedElements} from "@/calculator/types";
import {decimal} from "@/components/ui/ReduxForm/normalizers";
import {MACRO_ELEMENT_NAMES} from "@/calculator/constants";
import {StyledInput} from "@/components/ui/ReduxForm/Input";
import {ALLOWED_ELEMENT_IN_MATRIX, convertProfileWithEC, convertProfileWithRatio} from "@/calculator/profile";
import {StyledBalanceCell} from "@/components/Calculator/Options/Recipe";
import {round} from "@/utils";
import {ModalActions} from "@/components/ui/Modal/Modal";

interface RecipeTuneFormProps {
  modal: ModalActions,
  onSave: (npk: NeedElements) => void
}

const ELEMENT_IN_MATRIX = ALLOWED_ELEMENT_IN_MATRIX.filter(el => !["NH4", "NO3"].includes(el))

export function RecipeTuneForm(props: RecipeTuneFormProps) {
  const formValue = useFormValues<CalculatorFormValues>(useFormName())[0]
  const [recipe, setRecipe] = useState(formValue.recipe)
  const recipeInfo = calculateNPKBalance(recipe as Elements)
  const [ratio, setRatio] = useState(recipeInfo.ratio)
  const [EC, setEC] = useState(recipeInfo.EC)

  const onChangeRecipe = (el: MACRO_ELEMENT_NAMES, value: number) => {
    setRecipe({...recipe, [el]: value})
  }
  const onChangeEC = (val: number) => {
    setRecipe(convertProfileWithEC(recipe as Elements, val))
    setEC(val)
  }
  const onChangeRatio = (El1: ALLOWED_ELEMENT_IN_MATRIX, El2: ALLOWED_ELEMENT_IN_MATRIX, val: number) => {
    let currentEC = EC
    let newNpk = convertProfileWithRatio(recipe, {[El1]: {[El2]: val}})
    newNpk = convertProfileWithEC(newNpk, currentEC)
    setRecipe(newNpk)
    setRatio({...ratio, [El1]: {...ratio[El1], [El2]: val}})
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
            step={1}
          />
        ))}
        <RecipeInput name={'EC'} label={"EC"} value={EC} onChange={onChangeEC}/>
      </Flex>
      <Flex justifyContent="space-around">
        <StyledBalanceCell name="ΔΣ I" value={recipeInfo.ion_balance}/>
        <StyledBalanceCell name="EC" value={recipeInfo.EC}/>
        <RecipeInput
          name={'NH4'}
          label={"%NH4"}
          value={round(recipeInfo.ratio.NH4.NO3 * 100, 1)}
          step={0.1}
          onChange={v => onChangeRatio('NH4', 'NO3', v / 100)}
        />
        <StyledBalanceCell name="K:Mg" value={recipeInfo.ratio.K.Mg}/>
        <StyledBalanceCell name="K:Ca" value={recipeInfo.ratio.K.Ca}/>
        <StyledBalanceCell name="Ca:N" value={recipeInfo.ratio.Ca.N}/>
        <StyledBalanceCell name="N:K" value={recipeInfo.ratio.N.K}/>
        <StyledBalanceCell name="N:P" value={recipeInfo.ratio.N.P}/>
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
                      name={`${el}:${el2}`}
                      value={ratio[el][el2]}
                      onChange={value => onChangeRatio(el, el2, value)}
                    />
                  )}
                </td>
              ))}

            </tr>

          ))}
          </tbody>
        </table>
      </Flex>
      <Flex justifyContent="flex-end">
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
        max="999"
        autoComplete="off"
        maxWidth="6rem"
        lang="en-US"
        style={{
          textAlign: "center"
        }}
      />
    </Flex>
  )
}
