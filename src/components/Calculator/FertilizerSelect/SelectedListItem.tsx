import React, {FunctionComponent} from "react";
import {Box, Card, Flex, Text} from "rebass";
import {Cross} from "@styled-icons/entypo/Cross"
import {FertilizerType} from "./types";
import {normalizeFertilizer} from "../../../calculator/fertilizer";
import {FERTILIZER_ELEMENT_NAMES} from "../../../calculator/constants";
import {IconButton} from "../../ui/IconButton";

interface ElementProps {
  name: string,
  value: number,
}

export const Element: FunctionComponent<ElementProps> = ({name, value}) => {
  return (
    <Box bg="primary" flex={1} mx="2px" px={1} color={'background'} minWidth="2.5em">
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
                  value={normalizedFertilizer.elements[name]}
                />
              )
            }
          </Flex>
        </Box>
        <Flex alignItems="center" margin={1}>
          <Text>
            {needWeight || 0}
          </Text>
        </Flex>
        <IconButton
          padding={1}
          alignSelf="center"
          component={Cross}
          onClick={() => onRemove()}
        />
      </Flex>
    </Card>
  )
}
