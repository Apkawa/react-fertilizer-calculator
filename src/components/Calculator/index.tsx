import React from "react";
import {Box, Card, Flex, Heading, Text} from 'rebass'
import {Restart} from "@styled-icons/remix-line/Restart"
import {Form, reduxForm} from "redux-form";
import {connect, useDispatch} from "react-redux";

import FertilizerSelect from './FertilizerSelect'
import {Options} from "./Options/Options";
import {Result} from "./Result/Result";
import {CalculatorFormValues} from "./types";
import {ReduxFormType} from "../ui/ReduxForm/types";
import {REDUX_FORM_NAME} from "./constants";
import {calculateStart, fertilizerReset, recipeReset} from "./actions";
import {ImportFertilizers} from "@/components/Calculator/ImportExport/ImportFertilizers";
import {ExportFertilizers} from "@/components/Calculator/ImportExport/ExportFertilizers";
import {IconButton} from "@/components/ui/IconButton";
import {DEFAULT_MICRO_RECIPE, DEFAULT_RECIPES} from "@/components/Calculator/constants/recipes";
import {ExportRecipes} from "@/components/Calculator/ImportExport/ExportRecipes";
import {ImportRecipes} from "@/components/Calculator/ImportExport/ImportRecipes";
import {Recipe} from "@/components/Calculator/Options/Recipe";
import {mobileStyles} from "@/components/ui/styled";
import {RootState} from "@/redux/types";

interface CalculatorProps {

}

const initialValues: CalculatorFormValues = {
  accuracy: 0.2,
  solution_volume: 1,
  solution_concentration: 100,
  recipe: {...DEFAULT_RECIPES[0].elements, ...DEFAULT_MICRO_RECIPE},
  fertilizers: [],

  dilution_enabled: false,
  dilution_volume: 20,
  dilution_concentration: 1,
}
export const CalculatorContainer: ReduxFormType<CalculatorProps, CalculatorFormValues> = ({handleSubmit}) => {
  const dispatch = useDispatch()
  return (
    <Form
      onSubmit={handleSubmit(() => {
        dispatch(calculateStart())
      })}
    >
      <Flex sx={{
        flexDirection: 'row',
        ...mobileStyles({
          flexDirection: 'column-reverse',
        })
      }}>
        <Box flex={1}
             sx={{
               marginRight: 2,
               ...mobileStyles({
                 marginRight: 0
               })
             }}
        >
          <FertilizerSelect/>
        </Box>
        <Flex flexDirection='column' flex={1}>
          <Box flex={1} marginBottom={2}>
            <Recipe/>
          </Box>
          <Box flex={1}>
            <Result/>
          </Box>
          <Box flex={1}>
            <Options/>
          </Box>
          <Card>
            <Heading fontSize={2}>Импорт/Экспорт</Heading>
            <Flex flexDirection="column" p={3}>
              <Flex alignItems='center'
                    paddingBottom={2}
                    justifyContent="space-between"
                    flexWrap="wrap"
              >
                <Text>Удобрения</Text>
                <Box sx={{
                  "&>*": {
                    marginLeft: 1
                  }
                }}>
                  <ImportFertilizers/>
                  <ExportFertilizers/>
                  <IconButton
                    component={Restart}
                    onClick={() => dispatch(fertilizerReset())}
                  />
                </Box>
              </Flex>
              <Flex alignItems='center'
                    justifyContent="space-between"
                    flexWrap="wrap"
              >
                <Text>Рецепты</Text>
                <Box sx={{
                  "&>*": {
                    marginLeft: 1
                  }
                }}>
                  <ImportRecipes/>
                  <ExportRecipes/>
                  <IconButton
                    component={Restart}
                    onClick={() => dispatch(recipeReset())}
                  />
                </Box>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Form>
  )
}


const InitializerCalculator = reduxForm<CalculatorFormValues>({
  form: REDUX_FORM_NAME,
  initialValues,
  enableReinitialize: true
})(CalculatorContainer)

const ReduxCalculator = connect((state: RootState) => {
  const formValues: CalculatorFormValues = (state.calculator?.calculationForm || initialValues)
  return {
    initialValues: {
      ...formValues,
      recipe: {...DEFAULT_MICRO_RECIPE, ...formValues.recipe}
    }
  }})(InitializerCalculator)

export default ReduxCalculator
