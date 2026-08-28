import React, { type FunctionComponent } from "react";
import { Card, Flex, Heading } from "rebass";
import { Checkbox } from "@/components/ui/Form";

type IgnoreElementProps = {};

export const IgnoreElement: FunctionComponent<IgnoreElementProps> = () => {
  return (
    <Card>
      <Flex flexDirection="column">
        <Heading fontSize={2}>Игнорировать</Heading>
        <Checkbox name="ignore.Ca" label="Кальций" />
        <Checkbox name="ignore.Mg" label="Магний" />
        <Checkbox name="ignore.S" label="Сера" />
        <Checkbox name="ignore.Cl" label="Хлор" />
      </Flex>
    </Card>
  );
};
