import React, {FunctionComponent} from "react";
import {Card, Flex, Heading} from "rebass";
import {Label} from "@rebass/forms";
import {Input} from "../../ui/ReduxForm/Input";
import {number} from "../../ui/ReduxForm/normalizers";


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
            maxLength={3}
            pattern="^\d+$"
            normalize={number}
            style={{
              textAlign: "center"
            }}
            autoComplete="off"
          />
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" paddingTop={2}>
          <Label htmlFor="solution_concentration">Концетрация, %</Label>
          <Input
            name="solution_concentration"
            width="3rem"
            maxLength={3}
            pattern="^\d+$"
            normalize={number}
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
