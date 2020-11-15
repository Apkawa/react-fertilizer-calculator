import React, {FunctionComponent} from "react";
import {useSelector} from "react-redux";
import {getFormValues} from "redux-form";
import {Card, Flex} from "rebass";
import {Label} from "@rebass/forms";
import {Input} from "@/components/ui/ReduxForm/Input";
import {decimal, number} from "@/components/ui/ReduxForm/normalizers";
import {Checkbox} from "@/components/ui/ReduxForm/Checkbox";
import {REDUX_FORM_NAME} from "@/components/Calculator/constants";
import {CalculatorFormValues} from "@/components/Calculator/types";


interface DilutionProps {
}

export const Dilution: FunctionComponent<DilutionProps> = () => {
  const {
    dilution_enabled,
  } = useSelector(getFormValues(REDUX_FORM_NAME)) as CalculatorFormValues
  return (
    <Card>
      <Checkbox name="dilution_enabled" label="Разбавление концентрата"/>
      <Flex flexDirection="column" style={{display: dilution_enabled? "flex" : "none"}}>
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
        <Flex alignItems="center" justifyContent="space-between" paddingTop={2}>
          <Label htmlFor="dilution_concentration">Концентрация, 1/100%</Label>
          <Input
            name="dilution_concentration"
            width="3rem"
            type="number"
            step="0.1"
            min="0"
            max="2000"
            normalize={decimal}
            style={{
              textAlign: "center"
            }}
            autoComplete="off"
          />
        </Flex>
      </Flex>
    </Card>
  )
}
