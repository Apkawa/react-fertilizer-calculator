import React, {FunctionComponent, useEffect, useState} from "react";
import {Box, Button, Card, Flex} from "rebass";
import {FertilizerType} from "./types";
import {buildNPKFertilizer, Elements, FertilizerInfo, normalizeFertilizer} from "../../../calculator/fertilizer";
import {Dropdown} from "../../ui/Dropdown/Dropdown";
import {FERTILIZER_ELEMENT_NAMES} from "../../../calculator/constants";
import {AddItemElementForm} from "./AddItemElementForm";

interface AddItemProps {
  onAdd: (item: FertilizerType) => void
}


export const AddItem: FunctionComponent<AddItemProps> = ({onAdd}) => {
  const [selected, setSelected] = useState<FertilizerInfo>(defaultFertilizers[0])
  const [creating, setCreating] = useState(false)


  const getElements = (f: FertilizerInfo) => {
    return normalizeFertilizer(f, false).elements
  }

  const [elements, setElements] = useState<Elements>(getElements(selected))

  useEffect(() => {
    setElements(getElements(selected))
  }, [selected])

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
    let fertilizer = buildNPKFertilizer(selected.id, elements)
    onAdd(fertilizer)
    setCreating(false)
  }
  return (
    <Card>
      <Flex flexDirection="column">
        <Flex justifyContent="space-between">
          <Box flex={1} pr={2}>
            <Dropdown<FertilizerInfo>
              value={selected}
              items={defaultFertilizers}
              onChange={onChangeHandler}
              onEdit={onEditHandler}
              renderItem={({item}) => <span>{item.id}</span>}
              renderValue={item => item?.id || ""}
            />
          </Box>
          <Button
            type="button"
            onClick={onAddHandler}>Add</Button>
        </Flex>
        <Flex>
          {FERTILIZER_ELEMENT_NAMES.map(el => (
            <AddItemElementForm
              disabled={!creating}
              name={el}
              value={elements[el]}
              onChange={v => setElements({...elements, [el]: v})}
            />
          ))}
        </Flex>
      </Flex>

    </Card>
  )
}

const defaultFertilizers: FertilizerInfo[] = [
  buildNPKFertilizer(
    "Valagro 3:11:38",
    {
      N: 3, P: 11, K: 38, Ca: 0, Mg: 4,
    }),
  buildNPKFertilizer("Кальциевая селитра",
    {
      N: 16, Ca: 24,
    }),
  buildNPKFertilizer("Сульфат магния", {Mg: 16}),
  buildNPKFertilizer("Сульфат калия", {K: 50}),
  buildNPKFertilizer("Нитрат калия", {N: 14, K: 46})
]
