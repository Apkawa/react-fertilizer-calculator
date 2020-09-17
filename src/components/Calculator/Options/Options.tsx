import React, {ComponentType} from "react";
import {Box, Button, Flex} from "rebass";
import {IgnoreElement} from "./IgnoreElement";
import {Accuracy} from "./Accuracy";
import {Solution} from "./Solution";

interface OptionsProps {
}


export const Options: ComponentType<OptionsProps> = () => {
  return (
    <Flex flexDirection="column">
      <Box flex={1}>
        <Button width="100%" my={2} type="submit">Calculate</Button>
      </Box>
      <Box my={2}>
        <Solution/>
      </Box>
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

