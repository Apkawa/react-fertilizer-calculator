import { FERTILIZER_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { normalizeFertilizer } from "@fertilizer/calculator/fertilizer";
import { IconButton } from "@fertilizer/icons";
import React from "react";
import { useSelector } from "react-redux";
import type { CalculatorState } from "@/components/Calculator/types";
import { csvExport } from "@/utils/csv";
import { saveData } from "@/utils/downloads";

type ExportFertilizersProps = {};

export function ExportFertilizers(props: ExportFertilizersProps) {
  const { fertilizers } = useSelector<any>((state) => state.calculator) as CalculatorState;
  const doExport = () => {
    const npkFertilizer = fertilizers.map((f) => normalizeFertilizer(f, false));
    const rows = npkFertilizer.map((f) => {
      const cols = FERTILIZER_ELEMENT_NAMES.map((n) => f.elements[n]);
      return [f.id, ...cols];
    });
    const csvData = csvExport(rows, {
      columns: ["Удобрение", ...FERTILIZER_ELEMENT_NAMES],
      header: true,
    });
    saveData(csvData, "Удобрения.csv");
  };
  return (
    <>
      <IconButton onClick={doExport} name="export" />
    </>
  );
}
