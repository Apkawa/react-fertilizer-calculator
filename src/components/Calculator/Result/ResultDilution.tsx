import React from "react";
import {dilution_solution, DilutionResult} from "@/calculator/dilution";
import {useSelector} from "react-redux";
import {getFormValues} from "redux-form";
import {REDUX_FORM_NAME} from "@/components/Calculator/constants";
import {CalculatorFormValues} from "@/components/Calculator/types";
import {useFertilizerSolutionGroup, usePPM} from "@/components/Calculator/Result/hooks";
import {Flex, Heading} from "rebass";
import {ppmToEC} from "@/calculator/helpers";
import {round} from "@/utils";

interface DilutionResultProps {
}

export function ResultDilution(props: DilutionResultProps) {
  const {
    dilution_enabled,
    solution_concentration=1,
    dilution_volume=1,
    dilution_concentration=1,
  } = useSelector(getFormValues(REDUX_FORM_NAME)) as CalculatorFormValues

  const fertilizerWeightGroups = useFertilizerSolutionGroup()
  let ppm = usePPM()

  if (!dilution_enabled) {
    return null
  }

  ppm = round((dilution_concentration * ppm) / solution_concentration)

  let dilution: DilutionResult[] | null = null

  dilution = dilution_solution({
    id: "Total",
    volume: dilution_volume,
    concentration: dilution_concentration,
  }, fertilizerWeightGroups.map(([g]) => (
    {
      id: g, concentration: solution_concentration
    })))

  return (
    <>
      <Flex flexDirection="column" width="75%">
        <Heading fontSize={2}>Разбавление</Heading>
          <ul>
            {dilution.map(d => (
              <li>Раствор {d.id} - {d.volume < 1 ? `${d.volume * 1000}мл`: `${d.volume}л` }</li>
            ))}
            <li>
              Долить до {dilution_volume}л
            </li>
            <li>
              <b>TDS:</b> {ppm} ppm; <b>EC:</b> {ppmToEC(ppm, 1)} мСм/см
            </li>
          </ul>
      </Flex>

    </>
  )
}
