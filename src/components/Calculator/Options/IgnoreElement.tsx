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
        <Checkbox name="ignore.Ca" label="Кальций" />
        <Checkbox name="ignore.Mg" label="Магний" />
        <Checkbox name="ignore.S" label="Сера" />
      </Flex>
    </Card>
  )
}
