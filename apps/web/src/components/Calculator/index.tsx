import { normalizeConcentration } from "@fertilizer/calculator/dilution";
import { IconButton } from "@fertilizer/icons";
import React from "react";
import { connect, useDispatch } from "react-redux";
import { Box, Card, Flex, Heading, Text } from "rebass";
import { Form, reduxForm } from "redux-form";
import { DEFAULT_MICRO_RECIPE, DEFAULT_RECIPES } from "@/components/Calculator/constants/recipes";
import { Recipe } from "@/components/Calculator/Options/Recipe";
import { mobileStyles } from "@/components/ui/styled";
import type { RootState } from "@/redux/types";
import type { ReduxFormType } from "../ui/ReduxForm/types";
import { calculateStart, recipeReset } from "./actions";
import { REDUX_FORM_NAME } from "./constants";
import FertilizerSelect from "./FertilizerSelect";
import { ExportRecipes } from "./ImportExport/ExportRecipes";
import { ExportState } from "./ImportExport/ExportState";
import { ImportRecipes } from "./ImportExport/ImportRecipes";
import { ImportState } from "./ImportExport/ImportState";
import { Options } from "./Options/Options";
import { Result } from "./Result/Result";
import type { CalculatorFormValues } from "./types";

type CalculatorProps = {};

const initialValues: CalculatorFormValues = {
  accuracy: 0.2,
  solution_volume: 1,
  solution_concentration: normalizeConcentration(100),
  recipe: { ...DEFAULT_RECIPES[0].elements, ...DEFAULT_MICRO_RECIPE, Cl: 0 },
  fertilizers: [],
  dilution_enabled: false,
  dilution_concentration: normalizeConcentration(1),
  topping_up_enabled: false,
  mixerOptions: {},
};
export const CalculatorContainer: ReduxFormType<CalculatorProps, CalculatorFormValues> = ({
  handleSubmit,
}) => {
  const dispatch = useDispatch();
  return (
    <Form
      onSubmit={handleSubmit(() => {
        dispatch(calculateStart());
      })}
    >
      <Flex
        sx={{
          flexDirection: "row",
          ...mobileStyles({
            flexDirection: "column-reverse",
          }),
        }}
      >
        <Box
          flex={1}
          sx={{
            marginRight: 2,
            ...mobileStyles({
              marginRight: 0,
            }),
          }}
        >
          <FertilizerSelect />
        </Box>
        <Flex flexDirection="column" flex={1}>
          <Box flex={1} marginBottom={2}>
            <Recipe />
          </Box>
          <Box flex={1}>
            <Result />
          </Box>
          <Box flex={1}>
            <Options />
          </Box>
          <Card>
            <Heading fontSize={2}>Импорт/Экспорт</Heading>
            <Flex flexDirection="column" p={3}>
              <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap">
                <Text>Рецепты</Text>
                <Box
                  sx={{
                    "&>*": {
                      marginLeft: 1,
                    },
                  }}
                >
                  <ImportRecipes />
                  <ExportRecipes />
                  <IconButton name="restart" onClick={() => dispatch(recipeReset())} />
                </Box>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap">
                <Text>Настройки</Text>
                <Box
                  sx={{
                    "&>*": {
                      marginLeft: 1,
                    },
                  }}
                >
                  <ImportState />
                  <ExportState />
                </Box>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Form>
  );
};

const InitializerCalculator = reduxForm<CalculatorFormValues>({
  form: REDUX_FORM_NAME,
  initialValues,
  enableReinitialize: true,
})(CalculatorContainer);

const ReduxCalculator = connect((state: RootState) => {
  const formValues: CalculatorFormValues = state.calculator?.calculationForm || initialValues;
  return {
    initialValues: {
      ...formValues,
      recipe: { Cl: 0, ...DEFAULT_MICRO_RECIPE, ...formValues.recipe },
    },
  };
})(InitializerCalculator);

export default ReduxCalculator;
