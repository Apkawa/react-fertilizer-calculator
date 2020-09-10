import React, {FunctionComponent, useEffect, useState} from "react";
import {Flex} from "rebass";
import {FERTILIZER_ELEMENT_NAMES} from "../../../calculator/constants";
import {AddItemElementForm} from "./AddItemElementForm";
import {buildNPKFertilizer, Elements, FertilizerInfo, normalizeFertilizer} from "../../../calculator/fertilizer";

interface AddItemFertilizerEditFormProps {
  fertilizer: FertilizerInfo,
  allowEdit: boolean,
  onChange: (item: FertilizerInfo) => void
}

export const getElements = (f: FertilizerInfo) => {
  return normalizeFertilizer(f, false).elements
}

export const AddItemFertilizerEditForm: FunctionComponent<AddItemFertilizerEditFormProps> = (props) => {
  const {
    fertilizer,
    allowEdit
  } = props

  const [elements, setElements] = useState<Elements>(getElements(fertilizer))

  const onChangeHandler = (el: FERTILIZER_ELEMENT_NAMES, val: number) => {
    const newElements: Elements = {...elements, [el]: val}
    const newFertilizer = buildNPKFertilizer(fertilizer.id, newElements)
    setElements(newElements)
    props.onChange(newFertilizer)
  }

  useEffect(() => {
    setElements(getElements(fertilizer))
  }, [fertilizer])

  return (
    <Flex>
      <Flex>
        {FERTILIZER_ELEMENT_NAMES.map(el => (
          <AddItemElementForm
            disabled={!allowEdit}
            name={el}
            value={elements[el]}
            onChange={v => onChangeHandler(el, v)}
          />
        ))}
      </Flex>
    </Flex>
  )
}
