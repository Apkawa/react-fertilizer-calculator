import { Export } from "@styled-icons/boxicons-regular/Export";
import React from "react";
import { useSelector } from "react-redux";
import { FERTILIZER_ELEMENT_NAMES } from "@/calculator/constants";
import { normalizeFertilizer } from "@/calculator/fertilizer";
import type { CalculatorState } from "@/components/Calculator/types";
import { IconButton } from "@/components/ui/IconButton";
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
      <IconButton onClick={doExport} component={Export} />
    </>
  );
}
