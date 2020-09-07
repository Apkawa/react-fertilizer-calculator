import React, {FunctionComponent} from "react";
import {Card, Flex, Heading} from "rebass";
import {Checkbox} from "../../ui/ReduxForm/Checkbox";

interface IgnoreElementProps {
}


export const IgnoreElement: FunctionComponent<IgnoreElementProps> = () => {
  return (
    <Card>
      <Flex flexDirection="column">
        <Heading fontSize={2}>Игнорировать</Heading>
        <Checkbox name="ignore_Ca" label="Кальций" />
        <Checkbox name="ignore_Mg" label="Магний" />
      </Flex>
    </Card>
  )
}
