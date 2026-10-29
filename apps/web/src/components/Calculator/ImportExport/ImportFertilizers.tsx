import { FERTILIZER_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { buildNPKFertilizer } from "@fertilizer/calculator/fertilizer";
import React, { type ChangeEvent } from "react";
import { useStore } from "@/store";
import { csvParse } from "@/utils/csv";
import { FileImportButton } from "./FileImportButton";

type ImportFertilizersProps = {};

const COLUMNS = ["id", ...FERTILIZER_ELEMENT_NAMES];

export function ImportFertilizers(props: ImportFertilizersProps) {
  const loadCSV = (csv: string) => {
    const p = csvParse(csv, { columns: COLUMNS });
    if (isNaN(parseInt(p[0].P))) {
      p.splice(0, 1);
    }
    for (const { id, ...npk } of p) {
      const f = buildNPKFertilizer(id, npk);
      useStore.getState().pushFertilizer(f);
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
      ariaLabel="Импорт удобрений"
      accept="text/csv, .csv"
      onChange={(event) => handleOnChange(event)}
    />
  );
}
