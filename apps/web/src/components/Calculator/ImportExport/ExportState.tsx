import type { ExportStateType } from "@fertilizer/calculator/format/types";
import { Export } from "@styled-icons/boxicons-regular/Export";
import React from "react";
import { useSelector } from "react-redux";
import type { CalculatorState } from "@/components/Calculator/types";
import { IconButton } from "@/components/ui/IconButton";
import { saveData } from "@/utils/downloads";

type ExportRecipesProps = {};

export function ExportState(props: ExportRecipesProps) {
  const { calculationForm, result, fertilizers, recipes } = useSelector<any>(
    (state) => state.calculator,
  ) as CalculatorState;
  const doExport = () => {
    const created = new Date().toISOString();
    const state: ExportStateType = {
      meta: {
        version: __VERSION__,
        ref: __COMMIT_HASH__,
        created: created,
      },
      calculator: {
        calculationForm,
        result,
        fertilizers,
        recipes,
      },
    };
    const fileData = JSON.stringify(state, null, 4);
    saveData(fileData, `CalculatorSettings-${created}.json`);
  };
  return (
    <>
      <IconButton onClick={doExport} component={Export} title={"Экспорт настроек"} />
    </>
  );
}
