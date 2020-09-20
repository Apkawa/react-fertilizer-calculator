import React, {FunctionComponent, useState} from "react";
import {Box, Card, Flex} from "rebass";
import {FertilizerType} from "./types";
import {buildNPKFertilizer} from "@/calculator/fertilizer";
import {Dropdown} from "@/components/ui/Dropdown/Dropdown";
import {Plus} from "@styled-icons/boxicons-regular/Plus"

import {useDispatch, useSelector} from "react-redux";
import {CalculatorState} from "../types";
import {fertilizerPush, fertilizerRemove} from "../actions";
import {AddItemFertilizerEditForm, getElements} from "./AddItemFertilizerEditForm";
import {IconButton} from "@/components/ui/IconButton";
import {FertilizerInfo} from "@/calculator/types";

interface AddItemProps {
  onAdd: (item: FertilizerType) => void
}


export const AddItem: FunctionComponent<AddItemProps> = ({onAdd}) => {
  const {
    fertilizers,
  } = useSelector<any>(state => state.calculator) as CalculatorState
  const [selected, setSelected] = useState<FertilizerInfo | undefined>(fertilizers[0])
  const [creating, setCreating] = useState(false)

  const dispatch = useDispatch()


  const onChangeHandler = (item: FertilizerInfo | null) => {
    item && setSelected(item)
    setCreating(false)
  }

  const onChangeFertilizerElements = (item: FertilizerInfo) =>{
    setSelected(item)
    setCreating(true)
  }

  const onEditHandler = (value: string) => {
    const newFertilizer = buildNPKFertilizer(value, selected ? getElements(selected) : {})
    setSelected(newFertilizer)
  }
  const onAddHandler = () => {
    if (!selected) {
      return
    }
    let fertilizer = buildNPKFertilizer(selected.id, getElements(selected))
    onAdd(fertilizer)
    if (creating) {
      dispatch(fertilizerPush(selected))
    }
    setCreating(false)
  }
  const onRemoveItemHandler = (item: FertilizerInfo) => {
    dispatch(fertilizerRemove(item))
  }
  return (
    <Card>
      <Flex flexDirection="column">
        <Flex justifyContent="space-between">
          <Box flex={1} pr={2}>
            <Dropdown<FertilizerInfo>
              value={selected}
              items={fertilizers}
              onChange={onChangeHandler}
              onEdit={onEditHandler}
              renderItem={({item}) => (
                <Flex flex={1} justifyContent="space-between">
                  <Box>
                    {item.id}
                  </Box>
                  <button onClick={event => {
                    event.stopPropagation()
                    onRemoveItemHandler(item)
                  }}>-
                  </button>
                </Flex>
              )}
              renderValue={item => item?.id || ""}
            />
          </Box>
          <IconButton
            onClick={onAddHandler}
            component={Plus}/>

        </Flex>
        <AddItemFertilizerEditForm
          fertilizer={selected}
          onChange={onChangeFertilizerElements}
        />
      </Flex>

    </Card>
  )
}

