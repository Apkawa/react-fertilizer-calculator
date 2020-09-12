import React from "react";
import {Box, Flex, Card, Text, Heading} from 'rebass'
import {Restart} from "@styled-icons/remix-line/Restart"

import FertilizerSelect from './FertilizerSelect'
import {Options} from "./Options/Options";
import {Result} from "./Result/Result";
import {reduxForm} from "redux-form";
import {CalculatorFormValues} from "./types";
import {DEFAULT_RECIPES} from "./Options/Recipe";
import {ReduxFormType} from "../ui/ReduxForm/types";
import {REDUX_FORM_NAME} from "./constants";
import {useDispatch} from "react-redux";
import {calculateStart, fertilizerReset} from "./actions";
import {ImportFertilizers} from "@/components/Calculator/ImportExport/ImportFertilizers";
import {ExportFertilizers} from "@/components/Calculator/ImportExport/ExportFertilizers";
import {IconButton} from "@/components/ui/IconButton";

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
    <form
      onSubmit={handleSubmit(() => {
        dispatch(calculateStart())
      })}
    >
      <Flex sx={{
        flexDirection: 'row',
        '@media screen and (max-width: 800px)': {
          flexDirection: 'column-reverse'
        }
      }}>
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
          <Card>
            <Heading fontSize={2}>Импорт/Экспорт</Heading>
            <Flex flexDirection="column" p={3}>
              <Flex alignItems='center' justifyContent="space-between">
                <Text>Удобрения</Text>
                <Box sx={{
                  "&>*": {
                    marginLeft: 1
                  }
                }}>
                  <ImportFertilizers/>
                  <ExportFertilizers />
                  <IconButton
                    component={Restart}
                    onClick={() => dispatch(fertilizerReset())}
                  />
                </Box>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </form>
  )
}


export const Calculator = reduxForm<CalculatorFormValues>({
  form: REDUX_FORM_NAME,
  initialValues
})(CalculatorContainer)
