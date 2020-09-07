import React from "react";

import {Box, Flex} from 'rebass'

import FertilizerSelect from './FertilizerSelect'
import {Options} from "./Options/Options";
import {Result} from "./Result/Result";
import {reduxForm} from "redux-form";
import {CalculatorFormValues} from "./types";
import {DEFAULT_RECIPES} from "./Options/Recipe";
import {ReduxFormType} from "../ui/ReduxForm/types";
import {REDUX_FORM_NAME} from "./constants";
import {useDispatch} from "react-redux";
import {calculateStart} from "./actions";

interface CalculatorProps {

}

const initialValues: CalculatorFormValues = {
  accuracy: 0.2,
  solution_volume: 1,
  recipe: DEFAULT_RECIPES[0].elements,
  fertilizers: [],
}
export const CalculatorContainer: ReduxFormType<CalculatorProps, CalculatorFormValues> = ({handleSubmit}) => {
  const dispatch = useDispatch()
  return (
    <form onSubmit={handleSubmit((e) => {
      dispatch(calculateStart())
    })}>
      <Flex>
        <Box flex={1}>
          <FertilizerSelect/>
        </Box>
        <Flex flexDirection='column' mx={3} flex={1}>
          <Box flex={1}>
            <Result/>
          </Box>
          <Box flex={1}>
            <Options/>
          </Box>
        </Flex>
      </Flex>
    </form>
  )
}


export const Calculator = reduxForm<CalculatorFormValues>({
  form: REDUX_FORM_NAME,
  initialValues
})(CalculatorContainer)
