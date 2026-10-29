import { IconButton } from "@fertilizer/icons";
import { Card, Heading, Text } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
import { useStore } from "@/store";
import { FormProvider } from "@/store/form-context";
import { REDUX_FORM_NAME } from "./constants";
import { FertilizerManager } from "./FertilizerManager";
import { ExportFertilizers } from "./ImportExport/ExportFertilizers";
import { ExportRecipes } from "./ImportExport/ExportRecipes";
import { ExportState } from "./ImportExport/ExportState";
import { ImportFertilizers } from "./ImportExport/ImportFertilizers";
import { ImportRecipes } from "./ImportExport/ImportRecipes";
import { ImportState } from "./ImportExport/ImportState";
import { Options } from "./Options/Options";
import { Recipe } from "./Options/Recipe";
import { Result } from "./Result/Result";

type CalculatorProps = {};

// Главная форма калкулятора: FormProvider (calculatorOptions) + <form> для submit (кнопка Calculate).
// Поля формы (Options, FertilizerManager) читают/пишут глобальный zustand-стор через useFormField.
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
        {/* Layout канон макета (guideline §2.1–2.2): порог 800px — классы из
         * макета (index.html:147,150,423): ≥800px — две равные колонки
         * (grid-cols-2, удобрения слева), gap-2; <800px — одна колонка,
         * удобрения снизу. Порядок колонок приложения сохранён. */}
        <div className="grid grid-cols-1 gap-2 min-[800px]:grid-cols-2">
          {/* Карточка «Удобрения» (§3.1): классы порядка канона — снизу при
           * <800px, слева при ≥800px. */}
          <div className="flex flex-col order-2 min-[800px]:order-1">
            {/* Merged-карточка «Удобрения» (§3.1): менеджер над библиотекой
             * вместо дропдаун-селектора; слева при ≥800px, снизу при <800px. */}
            <FertilizerManager />
          </div>
          {/* Колонка контента (Recipe/Result/Options/Импорт-Экспорт): классы
           * порядка канона — сверху при <800px, справа при ≥800px. */}
          <div className="flex flex-col gap-2 order-1 min-[800px]:order-2">
            <Recipe />
            <Result />
            <Options />
            <Card>
              {/* Заголовок карточки — канон Heading (h2, 1.125rem/600), без override размера */}
              <Heading>Импорт/Экспорт</Heading>
              <div className="flex flex-col gap-2 p-4">
                {/* Строки ряда — канон (§3.5): подпись flex-1 слева, кнопки справа, gap-2 */}
                <div className="flex items-center gap-2">
                  <Text className="flex-1 font-semibold">Рецепты</Text>
                  <ImportRecipes />
                  <ExportRecipes />
                  <IconButton
                    name="restart"
                    aria-label="Сбросить рецепты"
                    onClick={() => recipeReset()}
                  />
                </div>
                {/* Строка «Удобрения» (т. заказчика): импорт/экспорт/сброс
                 * библиотеки переехали из шапки карточки «Удобрения» сюда,
                 * под строку «Рецепты». */}
                <div className="flex items-center gap-2">
                  <Text className="flex-1 font-semibold">Удобрения</Text>
                  <ImportFertilizers />
                  <ExportFertilizers />
                  <IconButton
                    name="restart"
                    aria-label="Сбросить удобрения"
                    onClick={() => useStore.getState().resetFertilizers()}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Text className="flex-1 font-semibold">Настройки</Text>
                  <ImportState />
                  <ExportState />
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
