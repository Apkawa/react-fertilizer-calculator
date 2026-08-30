import type { ExportStateType } from "@fertilizer/calculator/format/types";
import { IconButton } from "@fertilizer/icons";
import React from "react";
import { useStore } from "@/store";
import { saveData } from "@/utils/downloads";

type ExportStateProps = {};

export function ExportState(props: ExportStateProps) {
  const { calculationForm, result, fertilizers, recipes } = useStore((s) => s.calculator);
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
      <IconButton onClick={doExport} name="export" aria-label="Экспорт настроек" />
    </>
  );
}
