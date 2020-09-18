import React, {FunctionComponent} from "react";
import {Card, Flex, Heading, Text} from "rebass";
import {useSelector} from "react-redux";
import {CalculatorFormValues, CalculatorState} from "../types";
import {getFormValues} from "redux-form";
import {REDUX_FORM_NAME} from "../constants";
import {FERTILIZER_ELEMENT_NAMES} from "@/calculator/constants";
import {Element} from "../FertilizerSelect/SelectedListItem";
import styled from "styled-components";
import {calculateNPKBalance, getEmptyElements, ppmToEC} from "@/calculator/helpers";
import {StyledBalanceCell} from "../Options/Recipe";
import {ResultFertilizerList} from "./ResultFertilizerList";
import {useFertilizerSolutionGroup, usePPM} from "./hooks";
import {ResultDilution} from "@/components/Calculator/Result/ResultDilution";

interface ResultProps {
}

const StyledList = styled.ul`
  @media screen and (min-width: 800px) {
    width: 75%;
  }
`

function getScoreDisplay(score: number): string {
  let score_display = "Не соответствует";
  if (score >= 95) score_display = "Идеально";
  if (score >= 90 && score < 95) score_display = "Отлично";
  if (score >= 85 && score < 90) score_display = "Очень хорошо";
  if (score >= 80 && score < 85) score_display = "Хорошо";
  if (score >= 70 && score < 80) score_display = "Средне";
  if (score >= 60 && score < 70) score_display = "Плохо";
  if (score >= 40 && score < 60) score_display = "Ужасно";
  return score_display
}


export const Result: FunctionComponent<ResultProps> = () => {
  const {
    result,
  } = useSelector<any>(state => state.calculator) as CalculatorState

  const {
    solution_volume,
  } = useSelector(getFormValues(REDUX_FORM_NAME)) as CalculatorFormValues

  const ppm = usePPM()
  const fertilizerWeightGroups = useFertilizerSolutionGroup()

  const score = result?.score || 0
  const elements = result?.elements || getEmptyElements()
  const deltaElements = result?.deltaElements || getEmptyElements()
  const NPKBalance = calculateNPKBalance(elements)

  return (
    <Card>
      <Flex alignItems="center" flexDirection="column">
        <Flex>
          {elements && FERTILIZER_ELEMENT_NAMES.map(
            k => <Element
              key={k}
              name={k}
              value={elements[k]}
              delta={deltaElements[k]}
            />
          )}
        </Flex>

        <Flex justifyContent="space-around">
          <StyledBalanceCell name="ΔΣ I" value={NPKBalance.ion_balance}/>
          <StyledBalanceCell name="EC" value={NPKBalance.EC}/>
          <StyledBalanceCell name="%NH4" value={NPKBalance["%NH4"]}/>
          <StyledBalanceCell name="N:K" value={NPKBalance["N:K"]}/>
          <StyledBalanceCell name="K:Ca" value={NPKBalance["K:Ca"]}/>
          <StyledBalanceCell name="Ca:Mg" value={NPKBalance["Ca:Mg"]}/>
        </Flex>
        <Heading fontSize={2}>
          Оценка: {getScoreDisplay(score)}
        </Heading>

        <Text fontSize={6}>{`${score || 0}%`}</Text>
        <StyledList>
          <li>{solution_volume}л воды</li>
          {fertilizerWeightGroups.map(([g, f_weights]) =>
            (<li>
                <b> Раствор {g} </b>
                <ul>
                  <ResultFertilizerList fertilizers={f_weights}/>
                </ul>
              </li>
            )
          )}
          <li title="Или минерализация, в мг/л">
            <b>TDS:</b> {ppm} ppm; <b>EC:</b> {ppmToEC(ppm, 1)} мСм/см
          </li>
        </StyledList>
        <ResultDilution/>
        {result?.stats &&
        <Text>
          Обработано вариантов: {result?.stats.count} Время: {result?.stats.time} сек
        </Text>
        }
      </Flex>
    </Card>
  )
}

