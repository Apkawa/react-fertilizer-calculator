import React, {FunctionComponent} from "react";
import {Card, Flex, Heading} from "rebass";
import {Label} from "@rebass/forms";
import {Input} from "../../ui/ReduxForm/Input";
import {decimal} from "../../ui/ReduxForm/normalizers";
import {useSelector} from "react-redux";
import {getFormValues} from "redux-form";
import {REDUX_FORM_NAME} from "@/components/Calculator/constants";
import {CalculatorFormValues} from "@/components/Calculator/types";


interface SolutionVolumeProps {
}

export const Solution: FunctionComponent<SolutionVolumeProps> = () => {
  const {
    topping_up_enabled,
  } = useSelector(getFormValues(REDUX_FORM_NAME)) as CalculatorFormValues
  return (
    <Card>
        <Heading fontSize={2}>Раствор</Heading>
      <Flex flexDirection="column">
        <Flex alignItems="center" justifyContent="space-between">
          <Label htmlFor="solution_volume">Объем, л</Label>
          <Input
            disabled={topping_up_enabled}
            name="solution_volume"
            width="4rem"
            type="number"
            step="0.05"
            min="0.1"
            max="100"
            normalize={decimal}
            style={{
              textAlign: "center"
            }}
            autoComplete="off"
          />
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" paddingTop={2}>
          <Label htmlFor="solution_concentration">Концентрация, 1/100%</Label>
          <Input
            disabled={topping_up_enabled}
            name="solution_concentration"
            width="4rem"
            type="number"
            step="0.01"
            min="0"
            max="5000"
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
