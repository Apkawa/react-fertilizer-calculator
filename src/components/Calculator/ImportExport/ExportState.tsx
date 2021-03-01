import React from "react";
import {Export} from "@styled-icons/boxicons-regular/Export"
import {IconButton} from "@/components/ui/IconButton";
import {useSelector} from "react-redux";
import {CalculatorState} from "@/components/Calculator/types";
import {saveData} from "@/utils/downloads";
import {ExportStateType} from "@/components/Calculator/ImportExport/format/types";

interface ExportRecipesProps {
}

export function ExportState(props: ExportRecipesProps) {
  const {
    calculationForm,
    result,
    fertilizers,
    recipes,
  } = useSelector<any>(state => state.calculator) as CalculatorState
  const doExport = () => {
    const created = new Date().toISOString()
    const state: ExportStateType = {
      meta: {
        version: __VERSION__,
        ref: __COMMIT_HASH__,
        created: created
      },
      calculator: {
        calculationForm,
        result,
        fertilizers,
        recipes,
      }
    }
    const fileData = JSON.stringify(state, null, 4)
    saveData(fileData, `CalculatorSettings-${created}.json`)
  }
  return (
    <>
      <IconButton onClick={doExport} component={Export}
                  title={"Экспорт настроек"}
      />
    </>
  )
}
