import React, { type FunctionComponent } from "react";
import { Card, Flex, Heading } from "rebass";
import { decimal, Radio } from "@/components/ui/Form";

const ACCURACY_VARIANTS = [0.2, 0.1, 0.05, 0.01];
type AccuracyProps = {};

export const Accuracy: FunctionComponent<AccuracyProps> = () => {
  return (
    <Card>
      <Flex flexDirection="column">
        <Heading fontSize={2}>Точность</Heading>
        {ACCURACY_VARIANTS.map((a) => (
          <Radio key={a} name="accuracy" value={a} label={`${a} г.`} normalize={decimal} />
        ))}
      </Flex>
    </Card>
  );
};
