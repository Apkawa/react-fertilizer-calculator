import React, { FunctionComponent } from "react";
import {Card, Flex} from "rebass";
import {Input, Label} from "@rebass/forms";

interface SolutionVolumeProps {
}
export const SolutionVolume: FunctionComponent<SolutionVolumeProps> = () => {
    return (
      <Card>
        <Flex alignItems="center" justifyContent="space-between">
          <Label htmlFor="solution_volume">Объем раствора</Label>
          <Input
            width="3rem"
            name="solution_volume"
            maxLength={2} pattern="/^\d+$/"
            style={{
              textAlign: "center"
            }}
          />
        </Flex>
      </Card>
    )
}
