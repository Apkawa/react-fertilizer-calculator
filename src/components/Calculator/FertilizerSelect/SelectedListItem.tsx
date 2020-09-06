import React, {FunctionComponent} from "react";
import {Box, Button, Card, Flex, Text} from "rebass";
import {ELEMENT_NAMES} from "../constants";

interface ElementProps {
  name: string,
  value: number,
}

const Element: FunctionComponent<ElementProps> = ({name, value}) => {
  return (
    <Box bg="primary" flex={1} mx={1} px={2} color={'background'}>
      <Flex flexDirection='column' alignItems={'center'}>
        <Box>{name}</Box>
        <Box>{value}</Box>
      </Flex>
    </Box>
  )
}

interface SelectedListItemProps {
}


export const SelectedListItem: FunctionComponent<SelectedListItemProps> = () => {
  return (
      <Card width={'auto'}>
        <Flex justifyContent={'space-between'}>
          <Box>
            SelectedFertilizer
            <Flex justifyContent={'space-around'}>
              {
                ELEMENT_NAMES.map((name) => <Element name={name} value={0}/>
                )
              }
            </Flex>
          </Box>
          <Flex alignItems="center">
            <Text>
              1.0
            </Text>
          </Flex>
          <Button variant="outline">X</Button>
        </Flex>
      </Card>
  )
}
