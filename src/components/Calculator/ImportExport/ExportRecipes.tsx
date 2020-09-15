import React from "react";
import {Export} from "@styled-icons/boxicons-regular/Export"
import {IconButton} from "@/components/ui/IconButton";
import {useSelector} from "react-redux";
import {CalculatorState} from "@/components/Calculator/types";
import {FERTILIZER_ELEMENT_NAMES} from "@/calculator/constants";
import {csvExport} from "@/utils/csv";
import {saveData} from "@/utils/downloads";

interface ExportRecipesProps {
}

export function ExportRecipes(props: ExportRecipesProps) {
  const {
    recipes,
  } = useSelector<any>(state => state.calculator) as CalculatorState
  const doExport = () => {
    const rows = recipes.map(f => {
      const cols = FERTILIZER_ELEMENT_NAMES.map(n => f.elements[n])
      return [f.name, ...cols]
    })
    const csvData = csvExport(rows, {columns: ['Профиль', ...FERTILIZER_ELEMENT_NAMES], header: true})
    saveData(csvData, "Профили.csv")
  }
  return (
    <>
      <IconButton onClick={doExport} component={Export}/>
    </>
  )
}
