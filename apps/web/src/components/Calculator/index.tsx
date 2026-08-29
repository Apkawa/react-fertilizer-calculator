import { IconButton } from "@fertilizer/icons";
import { Card, Heading, Text } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
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
        {/* На десктопе колонки стоят рядом; на экранах ≤800px раскладка перевёрнута — снизу вверх */}
        <div className="flex max-[800px]:flex-col-reverse">
          <div className="mr-2 flex-1 max-[800px]:mr-0">
            <FertilizerSelect />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="mb-2 flex-1">
              <Recipe />
            </div>
            <div className="flex-1">
              <Result />
            </div>
            <div className="flex-1">
              <Options />
            </div>
            <Card>
              <Heading className="text-base">Импорт/Экспорт</Heading>
              <div className="flex flex-col p-4">
                <div className="flex flex-wrap items-center justify-between">
                  <Text>Рецепты</Text>
                  <div className="[&>*]:ml-1">
                    <ImportRecipes />
                    <ExportRecipes />
                    <IconButton name="restart" onClick={() => recipeReset()} />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between">
                  <Text>Настройки</Text>
                  <div className="[&>*]:ml-1">
                    <ImportState />
                    <ExportState />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default CalculatorContainer;
