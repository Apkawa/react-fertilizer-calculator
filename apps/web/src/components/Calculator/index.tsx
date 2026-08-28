import { IconButton } from "@fertilizer/icons";
import React, { type FunctionComponent } from "react";
import { Box, Card, Flex, Heading, Text } from "rebass";
import { mobileStyles } from "@/components/ui/styled";
import { useStore } from "@/store";
import { FormProvider } from "@/store/form-context";
import { REDUX_FORM_NAME } from "./constants";
import FertilizerSelect from "./FertilizerSelect";
import { ExportRecipes } from "./ImportExport/ExportRecipes";
import { ExportState } from "./ImportExport/ExportState";
import { ImportRecipes } from "./ImportExport/ImportRecipes";
import { ImportState } from "./ImportExport/ImportState";
import { Options } from "./Options/Options";
import { Recipe } from "./Options/Recipe";
import { Result } from "./Result/Result";

type CalculatorProps = {};

// Главная форма калкулятора: FormProvider (calculatorOptions) + <form> для submit (кнопка Calculate).
// Поля формы (Options, FertilizerSelect) читают/пишут глобальный zustand-стор через useFormField.
export const CalculatorContainer: FunctionComponent<CalculatorProps> = () => {
  const recipeReset = useStore((s) => s.resetRecipes);
  return (
    <FormProvider formName={REDUX_FORM_NAME}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          useStore.getState().calculate();
        }}
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
                    <IconButton name="restart" onClick={() => recipeReset()} />
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
      </form>
    </FormProvider>
  );
};

export default CalculatorContainer;
