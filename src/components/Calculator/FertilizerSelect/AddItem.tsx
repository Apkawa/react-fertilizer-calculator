import React, {FunctionComponent, useState} from "react";
import {Box, Card, Flex} from "rebass";
import {FertilizerType} from "./types";
import {Dropdown} from "@/components/ui/Dropdown/Dropdown";
import {Plus} from "@styled-icons/boxicons-regular/Plus"

import {useSelector} from "react-redux";
import {CalculatorState} from "../types";
import {IconButton} from "@/components/ui/IconButton";

interface AddItemProps {
  onAdd: (item: FertilizerType) => void
}


export const AddItem: FunctionComponent<AddItemProps> = ({onAdd}) => {
  const {
    fertilizers,
  } = useSelector<any>(state => state.calculator) as CalculatorState
  const {
    calculationForm,
  } = useSelector<any>(state => state.calculator) as CalculatorState

  const [selected, setSelected] = useState<FertilizerType | undefined>(fertilizers[0])

  const selectedFertilizers = calculationForm?.fertilizers || [];
  const fertilizersIDs = selectedFertilizers.map(f => f?.id)

  const onChangeHandler = (item: FertilizerType | null) => {
    item && setSelected(item)
  }


  const onAddHandler = (item: FertilizerType) => {
    onAdd(item)
  }
  return (
    <Card>
      <Flex flexDirection="column">
        <Flex justifyContent="space-between">
          <Box flex={1} pr={2}>
            <Dropdown<FertilizerType>
              value={selected}
              items={fertilizers}
              onChange={onChangeHandler}
              checkDisabledItem={item => fertilizersIDs.includes(item?.id || "")}
              renderItem={({item}) => (
                <Flex flex={1} justifyContent="space-between">
                  <Box>
                    {item.id}
                  </Box>
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation()
                      onAddHandler(item)
                    }}
                    component={Plus}
                  />
                </Flex>
              )}
              renderValue={item => item?.id || ""}
            />
          </Box>
        </Flex>
      </Flex>

    </Card>
  )
}

