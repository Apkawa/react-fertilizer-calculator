import React, {FunctionComponent} from "react";
import {Card, Flex, Heading} from "rebass";
import {Label} from "@rebass/forms";
import {Input} from "../../ui/ReduxForm/Input";
import {decimal, number} from "../../ui/ReduxForm/normalizers";


interface SolutionVolumeProps {
}

export const Solution: FunctionComponent<SolutionVolumeProps> = () => {
  return (
    <Card>
        <Heading fontSize={2}>Раствор</Heading>
      <Flex flexDirection="column">
        <Flex alignItems="center" justifyContent="space-between">
          <Label htmlFor="solution_volume">Объем, л</Label>
          <Input
            name="solution_volume"
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
          <Label htmlFor="solution_concentration">Концентрация, 1/100%</Label>
          <Input
            name="solution_concentration"
            width="3rem"
            type="number"
            step="0.1"
            min="0"
            max="999"
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
