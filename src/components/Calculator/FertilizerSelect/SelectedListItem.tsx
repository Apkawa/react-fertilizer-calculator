import React, {FunctionComponent} from "react";
import {Box, Button, Card, Flex, Text} from "rebass";
import {FertilizerType} from "./types";
import {normalizeFertilizer} from "../../../calculator/fertilizer";
import {useSelector} from "react-redux";
import {CalculatorState} from "../types";
import {FERTILIZER_ELEMENT_NAMES} from "../../../calculator/constants";

interface ElementProps {
  name: string,
  value: number,
}

export const Element: FunctionComponent<ElementProps> = ({name, value}) => {
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
  item: FertilizerType,
  onRemove: () => void,
  needWeight?: number,
}


export const SelectedListItem: FunctionComponent<SelectedListItemProps> = ({item, onRemove, needWeight}) => {
  const normalizedFertilizer = normalizeFertilizer(item, false)
  return (
    <Card width={'auto'}>
      <Flex justifyContent={'space-between'}>
        <Box>
          {item.id}
          <Flex justifyContent={'space-around'}>
            {
              FERTILIZER_ELEMENT_NAMES.map((name) =>
                <Element
                  name={name} key={name}
                  value={normalizedFertilizer[name]}
                />
              )
            }
          </Flex>
        </Box>
        <Flex alignItems="center">
          <Text>
            { needWeight || 0}
          </Text>
        </Flex>
        <Button variant="outline" type={'button'} onClick={() => onRemove()}>X</Button>
      </Flex>
    </Card>
  )
}
