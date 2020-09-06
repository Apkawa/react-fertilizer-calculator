import React, {FunctionComponent} from "react";
import {Card, Flex, Heading, Text} from "rebass";

interface ResultProps {
}

export const Result: FunctionComponent<ResultProps> = () => {
  return (
    <Card>
      <Flex alignItems="center" flexDirection="column">

        <Heading fontSize={2}>
          Оценка: Не соответствует
        </Heading>

        <Text fontSize={6}>100%</Text>
        <ul style={{width: '75%'}}>
          <li>1л воды</li>
        </ul>
      </Flex>
    </Card>
  )
}
