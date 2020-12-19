import React, {FunctionComponent} from "react";
import {Card, Flex, Heading, Text} from "rebass";
import {useSelector} from "react-redux";
import {CalculatorFormValues, CalculatorState} from "../types";
import {getFormValues} from "redux-form";
import {REDUX_FORM_NAME} from "../constants";
import {MACRO_ELEMENT_NAMES, MICRO_ELEMENT_NAMES} from "@/calculator/constants";
import {Element} from "../FertilizerSelect/SelectedListItem";
import styled from "styled-components";
import {calculateNPKBalance, getEmptyElements} from "@/calculator/helpers";
import {StyledBalanceCell} from "../Options/Recipe";
import {ResultFertilizerList} from "./ResultFertilizerList";
import {useFertilizerSolutionGroup} from "./hooks";
import {ResultDilution} from "@/components/Calculator/Result/ResultDilution";
import {round, sum} from "@/utils";

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

  const fertilizerWeightGroups = useFertilizerSolutionGroup()

  const score = result?.score || 0
  const elements = result?.elements || getEmptyElements()
  const deltaElements = result?.deltaElements || getEmptyElements()
  const NPKBalance = calculateNPKBalance(elements)

  // const liquidFertilizersVolume = round(sum((result?.fertilizers || []).map(f => f.volume || 0)), 1)
  const totalWeight =round(sum((result?.fertilizers || []).map(f => f.weight || 0)), 2)


  return (
    <Card>
      <Flex alignItems="center" flexDirection="column" width="100%">
        <Heading fontSize={2}>Результат расчета</Heading>
        <Flex justifyContent="space-around" width="100%">
          {elements && MACRO_ELEMENT_NAMES.map(
            k => <Element
              key={k}
              name={k}
              value={round(elements[k])}
              delta={round(deltaElements[k])}
            />
          )}
        </Flex>
        <Flex justifyContent="space-around" width="100%">
          {elements && MICRO_ELEMENT_NAMES.map(
            k => <Element
              key={k}
              name={k}
              value={round(elements[k] * 1000)}
              delta={round(deltaElements[k] * 1000)}
            />
          )}
        </Flex>
        <Flex justifyContent="space-around">
          <StyledBalanceCell name="ΔΣ I" value={NPKBalance.ion_balance}/>
          <StyledBalanceCell name="EC" value={NPKBalance.EC}/>
          <StyledBalanceCell name="%NH4" value={round((NPKBalance.ratio?.NH4?.NO3 || 0) * 100, 1)}/>
          <StyledBalanceCell name="K:Mg" value={NPKBalance.ratio.K.Mg}/>
          <StyledBalanceCell name="K:Ca" value={NPKBalance.ratio.K.Ca}/>
          <StyledBalanceCell name="Ca:N" value={NPKBalance.ratio.Ca.N}/>
        </Flex>
        <Heading fontSize={2}>
          Оценка: {getScoreDisplay(score)}
        </Heading>

        <Text fontSize={6}>{`${score || 0}%`}</Text>
        <StyledList>
          <li>Для {solution_volume}л раствора</li>
          {fertilizerWeightGroups.map(([g, f_weights]) =>
            (<li>
                <b> Раствор {g} </b>
                <ul>
                  <ResultFertilizerList fertilizers={f_weights}/>
                </ul>
              </li>
            )
          )}
          <li>Всего солей: {totalWeight} г.</li>
          <li>Концентрация солей: {round(totalWeight/solution_volume,2)} г/л</li>
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

