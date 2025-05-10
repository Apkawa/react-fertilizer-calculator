import React, {FunctionComponent} from "react";
import {Button, Card, Flex, Heading, Text} from "rebass";
import {useDispatch, useSelector} from "react-redux";
import {CalculatorFormValues, CalculatorState} from "../types";
import {getFormValues} from "redux-form";
import {REDUX_FORM_NAME} from "../constants";
import {MACRO_ELEMENT_NAMES, MICRO_ELEMENT_NAMES} from "@/calculator/constants";
import {Element} from "../FertilizerSelect/SelectedListItem";
import styled from "styled-components";
import {getEmptyElements, getNPKDetailInfo} from "@/calculator/helpers";
import {StyledBalanceCell} from "../Options/Recipe";
import {ResultFertilizerList} from "./ResultFertilizerList";
import {useFertilizerSolutionGroup} from "./hooks";
import {ResultDilution} from "@/components/Calculator/Result/ResultDilution";
import {round, sum} from "@/utils";
import {Modal, ModalActions} from "@/components/ui/Modal/Modal";
import {IconButton} from "@/components/ui/IconButton";
import {
  AddEdit as FertilizerAddEditForm,
  formToFertilizer,
  getInitialValues
} from "@/components/Calculator/FertilizerManager/AddEdit";
import {Save} from "@styled-icons/fa-regular/Save";
import {buildFertilizerFromSolution} from "@/calculator/fertilizer";
import {fertilizerPush} from "@/components/Calculator/actions";
import {useFormValues} from "@/hooks/ReduxForm";
import {AddEditFormType} from "@/components/Calculator/FertilizerManager/types";
import {FERTILIZER_EDIT_FORM_NAME} from "@/components/Calculator/FertilizerManager/constants";
import {MixerModal} from "@/components/Calculator/Mixer/Mixer";

interface ResultProps {
}

const StyledList = styled.ul`
  @media screen and (min-width: 800px) {
    width: 75%;
  }
`

export const Result: FunctionComponent<ResultProps> = () => {
  const {
    fertilizers,
    result,
  } = useSelector<any>(state => state.calculator) as CalculatorState

  const {
    solution_volume,
  } = useSelector(getFormValues(REDUX_FORM_NAME)) as CalculatorFormValues

  const fertilizerWeightGroups = useFertilizerSolutionGroup()

  const elements = result?.elements || getEmptyElements()
  const deltaElements = result?.deltaElements || getEmptyElements()
  const NPKBalance = getNPKDetailInfo(elements)

  // const liquidFertilizersVolume = round(sum((result?.fertilizers || []).map(f => f.volume || 0)), 1)
  const totalWeight = round(sum((result?.fertilizers || []).map(f => f.weight || 0)), 2)


  const [formValues] = useFormValues<AddEditFormType>(FERTILIZER_EDIT_FORM_NAME)
  const dispatch = useDispatch()
  const onSave = (modal: ModalActions) => {
    dispatch(fertilizerPush(formToFertilizer(formValues)))
    modal.close()
  }
  const complexFertilizer = buildFertilizerFromSolution("", {
    fertilizers,
    fertilizer_weights: result?.fertilizers || [],
    volume: solution_volume,
  })

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
          <StyledBalanceCell
            name="ΔΣ I"
            value={NPKBalance.ion_balance}
            title={"Ионный баланс, дб == 0±5%"}
          />
          <StyledBalanceCell name="EC" value={NPKBalance.EC}/>
          <StyledBalanceCell name="%NH4" value={round((NPKBalance.ratio?.NH4?.NO3 || 0) * 100, 1)}/>
          <StyledBalanceCell name="K:N" value={NPKBalance.ratio.K.N}/>
          <StyledBalanceCell name="K:Ca" value={NPKBalance.ratio.K.Ca}/>
          <StyledBalanceCell name="K:Mg" value={NPKBalance.ratio.K.Mg}/>
        </Flex>
        <StyledList>
          <li>Для {solution_volume}л раствора</li>
          {fertilizerWeightGroups.map(([g, f_weights]) =>
            (<li>
                <b>
                  Раствор {g}
                </b>
                <ul>
                  <ResultFertilizerList fertilizers={f_weights}/>
                </ul>
              </li>
            )
          )}
          <li>Всего солей: {totalWeight} г.</li>
          <li>Концентрация солей: {round(totalWeight / solution_volume, 2)} г/л</li>
        </StyledList>
        <ResultDilution/>
        {result?.stats &&
        <Text>
          Обработано вариантов: {result?.stats.count} Время: {result?.stats.time} сек
        </Text>
        }
        <Flex>

          {result?.fertilizers ?
            <Flex>
              <Modal
                button={({modal}) => (
                  <IconButton
                    padding={1}
                    alignSelf="center"
                    component={Save}
                    backgroundColor={'primary'}
                    onClick={modal.open}
                  >Сохранить комплекс</IconButton>
                )}
                container={({modal}) => (
                  <>
                    <FertilizerAddEditForm
                      initialValues={getInitialValues(complexFertilizer)}
                    />
                    <Flex justifyContent="flex-end">
                      <Button type="button" onClick={() => onSave(modal)}>Save</Button>
                    </Flex>
                  </>
                )}
              />
            </Flex>
            : null}
          <Flex>
            <MixerModal/>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  )
}

