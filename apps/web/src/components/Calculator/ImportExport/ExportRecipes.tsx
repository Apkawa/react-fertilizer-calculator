import { FERTILIZER_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { IconButton } from "@fertilizer/icons";
import React from "react";
import { useSelector } from "react-redux";
import type { CalculatorState } from "@/components/Calculator/types";
import { csvExport } from "@/utils/csv";
import { saveData } from "@/utils/downloads";

type ExportRecipesProps = {};

export function ExportRecipes(props: ExportRecipesProps) {
  const { recipes } = useSelector<any>((state) => state.calculator) as CalculatorState;
  const doExport = () => {
    const rows = recipes.map((f) => {
      const cols = FERTILIZER_ELEMENT_NAMES.map((n) => f.elements[n]);
      return [f.name, ...cols];
    });
    const csvData = csvExport(rows, {
      columns: ["Профиль", ...FERTILIZER_ELEMENT_NAMES],
      header: true,
    });
    saveData(csvData, "Профили.csv");
  };
  return (
    <>
      <IconButton onClick={doExport} name="export" />
    </>
  );
}
