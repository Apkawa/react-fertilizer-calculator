import React, {FunctionComponent} from "react";
import {Card, Flex, Heading} from "rebass";
import {Radio} from "../../ui/ReduxForm/Radio";
import {decimal, number} from "../../ui/ReduxForm/normalizers";

const ACCURACY_VARIANTS = [
  0.2,
  0.1,
  0.05,
  0.01,
]
interface AccuracyProps {
}

export const Accuracy: FunctionComponent<AccuracyProps> = () => {
    return (
      <Card>
          <Flex flexDirection="column">
            <Heading fontSize={2}>Точность</Heading>
            {ACCURACY_VARIANTS.map(a =>
                <Radio
                  name="accuracy"
                  value={a}
                  label={`${a} грамма`}
                  normalize={decimal}
                />
            )}
          </Flex>
      </Card>
    )
}
