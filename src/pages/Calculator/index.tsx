import React from "react";
import {Calculator} from "@/components/Calculator";
import {Box, Flex, Heading} from "rebass";
import {IconButton} from "@/components/ui/IconButton";
import {Help} from '@styled-icons/entypo/Help'
import {Link} from "react-router-dom";


export default () => {
  return (
    <Flex sx={
      {
        justifyContent: 'center'
      }
    }>
      <Box width='936px'>
        <Flex sx={{
          justifyContent: "space-between",
          '@media screen and (max-width: 1350px)': {
            justifyContent: "flex-start",
          }
        }}>
          <Heading>Калькулятор удобрений</Heading>
          <Link to="/help">
            <IconButton
              padding={1}
              marginLeft={3}
              size={30}
              component={Help}
            />
          </Link>
        </Flex>
        <Calculator/>
      </Box>
    </Flex>
  )
}
