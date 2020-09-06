import React from "react";
import {Calculator} from "../../components/Calculator";
import {Box, Flex} from "rebass";


export default () => {
  return (
    <Flex sx={
      {
        margin: "1rem",
        justifyContent: 'center'
      }
    }>
      <Box width='936px'>
        <h1>Calculator</h1>
        <Calculator/>
      </Box>
    </Flex>
  )
}
