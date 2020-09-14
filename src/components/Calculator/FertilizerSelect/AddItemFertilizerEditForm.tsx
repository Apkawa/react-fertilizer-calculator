import React, {FunctionComponent, useEffect, useState} from "react";
import {Flex} from "rebass";
import {FERTILIZER_ELEMENT_NAMES} from "../../../calculator/constants";
import {AddItemElementForm} from "./AddItemElementForm";
import {buildNPKFertilizer, normalizeFertilizer} from "../../../calculator/fertilizer";
import {Elements, FertilizerInfo} from "@/calculator/types";

interface AddItemFertilizerEditFormProps {
  fertilizer?: FertilizerInfo,
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

  const [elements, setElements] = useState<Elements|undefined>(fertilizer && getElements(fertilizer))

  const onChangeHandler = (el: FERTILIZER_ELEMENT_NAMES, val: number) => {
    if (!elements || !fertilizer){
      return
    }
    const newElements: Elements = {...elements, [el]: val}
    const newFertilizer = buildNPKFertilizer(fertilizer.id, newElements)
    setElements(newElements)
    props.onChange(newFertilizer)
  }

  useEffect(() => {
    setElements(fertilizer && getElements(fertilizer))
  }, [fertilizer])

  return (
    <Flex>
      <Flex>
        {FERTILIZER_ELEMENT_NAMES.map(el => (
          <AddItemElementForm
            disabled={!allowEdit}
            name={el}
            value={elements?.[el]||0}
            onChange={v => onChangeHandler(el, v)}
          />
        ))}
      </Flex>
    </Flex>
  )
}
