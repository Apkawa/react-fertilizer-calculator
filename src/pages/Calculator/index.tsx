import React from "react";
import {Calculator} from "../../components/Calculator";
import {Box, Flex, Heading} from "rebass";


export default () => {
  return (
    <Flex sx={
      {
        margin: "1rem",
        justifyContent: 'center'
      }
    }>
      <Box width='936px'>
        <Heading>Калькулятор удобрений</Heading>
        <Calculator/>
      </Box>
    </Flex>
  )
}
