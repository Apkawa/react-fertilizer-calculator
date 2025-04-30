import React from "react";
import {dilution_solution, DilutionResult, normalizeConcentration} from "@/calculator/dilution";
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
    solution_concentration= normalizeConcentration(1),
    solution_volume = 1,
    dilution_concentration = normalizeConcentration(1),
  } = useSelector(getFormValues(REDUX_FORM_NAME)) as CalculatorFormValues

  const fertilizerWeightGroups = useFertilizerSolutionGroup()
  let ppm = usePPM()

  if (!dilution_enabled) {
    return null
  }

  const dilution_con = normalizeConcentration(dilution_concentration)

  const newPpm = round((dilution_con.k * ppm) / solution_concentration.k)

  let dilution: DilutionResult[] | null = null

  dilution = dilution_solution({
    id: "Total",
    volume: solution_volume,
    concentration: solution_concentration,
  }, fertilizerWeightGroups.map(([g]) => (
    {
      id: g, concentration: dilution_con
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
              Долить до {solution_volume}л
            </li>
            <li>
              <b>TDS:</b> {newPpm} ppm; <b>EC:</b> {ppmToEC(newPpm, 1)} мСм/см
            </li>
          </ul>
      </Flex>

    </>
  )
}
