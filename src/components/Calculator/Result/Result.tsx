import React, {FunctionComponent} from "react";
import {Card, Flex, Heading, Text} from "rebass";
import {useSelector} from "react-redux";
import {CalculatorFormValues, CalculatorState} from "../types";
import {getFormValues} from "redux-form";
import {REDUX_FORM_NAME} from "../constants";
import {countDecimals, round} from "@/utils";
import {FERTILIZER_ELEMENT_NAMES} from "@/calculator/constants";
import {Element} from "../FertilizerSelect/SelectedListItem";
import styled from "styled-components";
import {calculatePPM, getEmptyElements, ppmToEC} from "@/calculator/helpers";

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
    solution_concentration = 100,
    accuracy
  } = useSelector(getFormValues(REDUX_FORM_NAME)) as CalculatorFormValues

  const fertilizers = (result?.fertilizers || []).map(f => ({...f}))
  const ppm = calculatePPM(
    fertilizers,
    solution_volume,
    solution_concentration,
  )
  const score = result?.score || 0
  const elements = result?.elements || getEmptyElements()
  fertilizers.forEach(f => {
    f.weight = f.weight
      * solution_volume
      * (solution_concentration / 100)
  })
  return (
    <Card>
      <Flex alignItems="center" flexDirection="column">
        <Flex>
          {elements && FERTILIZER_ELEMENT_NAMES.map(
            k => <Element name={k} value={elements[k]}/>
          )}
        </Flex>
        <Heading fontSize={2}>
          Оценка: {getScoreDisplay(score)}
        </Heading>

        <Text fontSize={6}>{`${score || 0}%`}</Text>
        <StyledList>
          <li>{solution_volume}л воды</li>
          {fertilizers.map(f => {
            return (
              <li key={f.id}>
                {round(f.weight, countDecimals(accuracy))}г {f.id}
              </li>
            )
          })}
          <li title="Или минерализация, в мг/л">
            <b>TDS:</b> {ppm} ppm
          </li>
          <li title="">
            {[1.0, 0.7, 0.5].map(k => {
              return (<p><b>EC({k}):</b> {ppmToEC(ppm, k)} мСм/см</p>)
            })}
          </li>
        </StyledList>

        {result?.stats &&
        <Text>
          Обработано вариантов: {result?.stats.count} Время: {result?.stats.time} сек
        </Text>
        }
      </Flex>
    </Card>
  )
}
