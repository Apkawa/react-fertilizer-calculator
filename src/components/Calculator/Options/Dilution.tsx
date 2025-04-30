import React, {FunctionComponent} from "react";
import {useDispatch, useSelector} from "react-redux";
import {change, getFormValues} from "redux-form";
import {Card, Flex, Text} from "rebass";
import {Label} from "@rebass/forms";
import {Input} from "@/components/ui/ReduxForm/Input";
import {decimal, number} from "@/components/ui/ReduxForm/normalizers";
import {Checkbox} from "@/components/ui/ReduxForm/Checkbox";
import {REDUX_FORM_NAME} from "@/components/Calculator/constants";
import {CalculatorFormValues} from "@/components/Calculator/types";
import {Concentration, normalizeConcentration} from "@/calculator/dilution";


interface DilutionProps {
}

export const Dilution: FunctionComponent<DilutionProps> = () => {
  const {
    dilution_enabled, dilution_concentration,
  } = useSelector(getFormValues(REDUX_FORM_NAME)) as CalculatorFormValues
  const dispatch = useDispatch();

  const onChange = (field: string) => (event: any) => {
    if (!event.target.value) {
      return
    }
    let k = parseFloat(event.target.value)

    let newCon: Partial<Concentration> = {}
    if (field === 'k') {
      newCon.k = k
    } else {
      newCon = {...dilution_concentration, [field]: k}
      delete newCon.k
    }
    const newConcentration = normalizeConcentration(newCon)
    dispatch(change(REDUX_FORM_NAME, 'dilution_concentration', newConcentration))
  }
  return (
    <Card>
      <Checkbox name="dilution_enabled" label="Разбавление концентрата"/>
      <Flex flexDirection="column" style={{display: dilution_enabled ? "flex" : "none"}}>
        <Flex alignItems="center" justifyContent="space-between">
          <Label htmlFor="dilution_volume">Объем, л</Label>
          <Input
            name="dilution_volume"
            width="3rem"
            type="number"
            step="1"
            min="1"
            pattern="^\d+$"
            normalize={number}
            style={{
              textAlign: "center"
            }}
            autoComplete="off"
          />
        </Flex>
        <Flex>
          <Label htmlFor="dilution_concentration.k">Концентрация</Label>
        </Flex>
        <Flex alignItems="center" paddingTop={2}>
          <Text fontSize={"2rem"}>1:</Text>
          <Input
            name="dilution_concentration.k"
            type="number"
            width={'auto'}
            step="0.1"
            min="1"
            max="2000"
            normalize={decimal}
            style={{
              textAlign: "center"
            }}
            autoComplete="off"
            onChange={onChange('k')}
          />
        </Flex>
        <Flex alignItems={"center"}>
          Или
          <Input
            name="dilution_concentration.v_1"
            type="number"
            width={"4rem"}
            step="0.1"
            min="0"
            max="50000"
            normalize={decimal}
            style={{
              textAlign: "center"
            }}
            autoComplete="off"
            onChange={onChange('v_1')}
          />
          мл

          на
          <Input
            name="dilution_concentration.v_2"
            type="number"
            width={"4rem"}
            step="1"
            min="0"
            max="1000000"
            normalize={decimal}
            style={{
              textAlign: "center"
            }}
            autoComplete="off"
            onChange={onChange('v_2')}
          />
          мл. рабочего раствора

        </Flex>
      </Flex>
    </Card>
  )
}
