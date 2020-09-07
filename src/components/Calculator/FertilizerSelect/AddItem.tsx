import React, {FunctionComponent, useState} from "react";
import {Box, Button, Card, Flex} from "rebass";
import {Select} from '@rebass/forms'
import {FertilizerType} from "./types";
import {buildNPKFertilizer, FertilizerInfo} from "../../../calculator/fertilizer";

interface AddItemProps {
  onAdd: (item: FertilizerType) => void
}


export const AddItem: FunctionComponent<AddItemProps> = ({onAdd}) => {
  const [selected, setSelected] = useState<string>(defaultFertilizers[0].id)

  const onAddHandler = () => {
    for (let info of defaultFertilizers) {
      if (info.id === selected) {
        onAdd(info)
      }
    }
  }
  return (
    <Card>
      <Flex sx={{justifyContent: 'space-around'}}>
        <Box flex={1} pr={2}>
          <Select onChange={(e) => setSelected(e.target.value)}>
            {defaultFertilizers.map(info =>
              <option value={info.id} key={info.id}>{info.id}</option>
            )}
          </Select>
        </Box>
        <Button
          type="button"
          onClick={onAddHandler}>Add</Button>
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
