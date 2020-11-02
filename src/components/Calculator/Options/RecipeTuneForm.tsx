import React, {ChangeEvent, useState} from "react";
import {useFormName, useFormValues} from "@/hooks/ReduxForm";
import {CalculatorFormValues} from "@/components/Calculator/types";
import {Box, Flex} from "rebass";
import {calculateNPKBalance} from '../../../calculator/helpers';
import {Elements} from "../../../calculator/types";
import {decimal} from "@/components/ui/ReduxForm/normalizers";
import {MACRO_ELEMENT_NAMES} from "@/calculator/constants";
import {StyledInput} from "@/components/ui/ReduxForm/Input";
import {ALLOWED_ELEMENT_IN_MATRIX, convertProfileWithEC} from "@/calculator/profile";
import {StyledBalanceCell} from "@/components/Calculator/Options/Recipe";

interface RecipeTuneFormProps {

}

export function RecipeTuneForm(props: RecipeTuneFormProps) {
  const formValue = useFormValues<CalculatorFormValues>(useFormName())[0]
  const [recipe, setRecipe] = useState(formValue.recipe)
  const recipeInfo = calculateNPKBalance(recipe as Elements)
  const onChangeRecipe = (el: typeof MACRO_ELEMENT_NAMES[number], value: number) => {
    setRecipe({...recipe, [el]: value})
  }
  const onChangeEC = (val: number) => {
    setRecipe(convertProfileWithEC(recipe as Elements, val))
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
        <RecipeInput name={'EC'} label={"EC"} value={recipeInfo.EC} onChange={onChangeEC}/>
      </Flex>
      <Flex justifyContent="space-around">
        <StyledBalanceCell name="ΔΣ I" value={recipeInfo.ion_balance}/>
        <StyledBalanceCell name="EC" value={recipeInfo.EC}/>
        <StyledBalanceCell name="%NH4" value={recipeInfo["%NH4"]}/>
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
            {ALLOWED_ELEMENT_IN_MATRIX.map(el => <th>{el}</th>)}
          </tr>
          </thead>
          <tbody>
          {ALLOWED_ELEMENT_IN_MATRIX.map(el => (
            <tr>
              <th>{el}</th>
              {ALLOWED_ELEMENT_IN_MATRIX.map(el2 => (
                <td style={{textAlign: 'center'}}>
                  {el === el2 ? 1 : (
                    <RecipeInput
                      name={`${el}:${el2}`}
                      value={recipeInfo.ratio[el][el2]}
                    />

                  )}

                </td>
              ))}

            </tr>

          ))}
          </tbody>
        </table>
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
    const val = decimal(e.target.value)
    onChange && onChange(val)
  }

  return (
    <Flex flexDirection="column"
          justifyContent="center"
          alignItems="center"
          maxWidth='4rem'
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
        maxWidth="4rem"
        style={{
          textAlign: "center"
        }}
      />
    </Flex>
  )
}
