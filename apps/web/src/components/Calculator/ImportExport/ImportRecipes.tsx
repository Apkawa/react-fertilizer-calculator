import { FERTILIZER_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import React, { type ChangeEvent } from "react";
import { useStore } from "@/store";
import { csvParse } from "@/utils/csv";
import { FileImportButton } from "./FileImportButton";

type ImportRecipesProps = {};

const COLUMNS = ["id", ...FERTILIZER_ELEMENT_NAMES];

export function ImportRecipes(props: ImportRecipesProps) {
  const loadCSV = (csv: string) => {
    const p = csvParse(csv, { columns: COLUMNS });
    if (isNaN(parseInt(p[0].P))) {
      p.splice(0, 1);
    }
    for (const { id, ...npk } of p) {
      useStore.getState().pushRecipe({ name: id, elements: npk });
    }
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value, e.target.files?.[0]);
    const file = e.target.files?.[0];
    if (!file) {
      return file;
    }
    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);
      loadCSV(reader.result as string);
    };
    reader.readAsText(file);
  };
  return (
    <FileImportButton
      ariaLabel="Импорт рецептов"
      accept="text/csv, .csv"
      onChange={(event) => handleOnChange(event)}
    />
  );
}
