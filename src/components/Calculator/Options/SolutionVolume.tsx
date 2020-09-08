import React, {FunctionComponent} from "react";
import {Card, Flex} from "rebass";
import {Label} from "@rebass/forms";
import {Input} from "../../ui/ReduxForm/Input";
import {number} from "../../ui/ReduxForm/normalizers";


interface SolutionVolumeProps {
}

export const SolutionVolume: FunctionComponent<SolutionVolumeProps> = () => {
  return (
    <Card>
      <Flex alignItems="center" justifyContent="space-between">
        <Label htmlFor="solution_volume">Объем раствора</Label>
        <Input
          name="solution_volume"
          width="3rem"
          maxLength={2}
          pattern="^\d+$"
          normalize={number}
          style={{
            textAlign: "center"
          }}
          autoComplete="off"
        />
      </Flex>
    </Card>
  )
}
