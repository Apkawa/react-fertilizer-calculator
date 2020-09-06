import React from "react";

import {Box, Flex} from 'rebass'

import FertilizerSelect from './FertilizerSelect'
import {Options} from "./Options/Options";
import {Result} from "./Result/Result";

export function Calculator() {
  return (
    <Flex>
      <Box flex={1}>
        <FertilizerSelect/>
      </Box>
      <Flex flexDirection='column' mx={3} flex={1}>
        <Box flex={1}>
          <Result/>
        </Box>
        <Box flex={1}>
          <Options/>
        </Box>
      </Flex>
    </Flex>
  )
}
