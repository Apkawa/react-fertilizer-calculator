import React, {FunctionComponent, useState} from "react";
import {Box, Button, Card, Flex} from "rebass";
import {FertilizerType} from "./types";
import {buildNPKFertilizer, FertilizerInfo} from "../../../calculator/fertilizer";
import {Dropdown} from "../../ui/Dropdown/Dropdown";
import {useDispatch, useSelector} from "react-redux";
import {CalculatorState} from "../types";
import {fertilizerPush, fertilizerRemove} from "../actions";
import {AddItemFertilizerEditForm, getElements} from "./AddItemFertilizerEditForm";

interface AddItemProps {
  onAdd: (item: FertilizerType) => void
}


export const AddItem: FunctionComponent<AddItemProps> = ({onAdd}) => {
  const {
    fertilizers,
  } = useSelector<any>(state => state.calculator) as CalculatorState
  const [selected, setSelected] = useState<FertilizerInfo>(fertilizers[0])
  const [creating, setCreating] = useState(false)

  const dispatch = useDispatch()


  const onChangeHandler = (item: FertilizerInfo | null) => {
    item && setSelected(item)
    setCreating(false)
  }

  const onEditHandler = (value: string) => {
    const emptyFertilizer = buildNPKFertilizer(value, {})
    setSelected(emptyFertilizer)
    setCreating(true)
  }
  const onAddHandler = () => {
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
          <Button
            type="button"
            onClick={onAddHandler}>Add</Button>
        </Flex>
        <AddItemFertilizerEditForm
          fertilizer={selected}
          allowEdit={creating}
          onChange={item => setSelected(item)}
        />
      </Flex>

    </Card>
  )
}

