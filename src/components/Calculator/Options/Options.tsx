import React, {FunctionComponent} from "react";
import {Box, Button, Flex} from "rebass";
import {Recipe} from "./Recipe";
import {IgnoreElement} from "./IgnoreElement";
import {Accuracy} from "./Accuracy";
import {SolutionVolume} from "./SolutionVolume";

interface OptionsProps {
}

export const Options: FunctionComponent<OptionsProps> = () => {
  return (
    <Flex flexDirection="column">
      <Box flex={1}>
        <Button width="100%" my={2}>Calculate</Button>
      </Box>
      <Box flex={1}>
        <Recipe/>
      </Box>
      <SolutionVolume/>
      <Flex sx={{
        '& > *': {flex: 1}
      }}>
        <IgnoreElement/>
        <Box marginLeft={2}>
          <Accuracy/>
        </Box>
      </Flex>

    </Flex>
  )
}
