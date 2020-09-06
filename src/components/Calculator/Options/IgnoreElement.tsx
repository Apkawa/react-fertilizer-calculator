import React, {FunctionComponent} from "react";
import {Card, Flex, Heading} from "rebass";
import {Checkbox, Label} from "@rebass/forms";

interface IgnoreElementProps {
}

export const IgnoreElement: FunctionComponent<IgnoreElementProps> = () => {
  return (
    <Card>
      <Flex flexDirection="column">
        <Heading fontSize={2}>Игнорировать</Heading>
        <Label>
          <Checkbox name="ignore_Ca"/>
          Кальций
        </Label>
        <Label>
          <Checkbox name="ignore_Mg"/>
          Магний
        </Label>
      </Flex>
    </Card>
  )
}
