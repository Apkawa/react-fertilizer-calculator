import React, {FunctionComponent, useEffect, useState} from "react";
import {Flex} from "rebass";
import {FERTILIZER_ELEMENT_NAMES, MACRO_ELEMENT_NAMES} from "../../../calculator/constants";
import {AddItemElementForm} from "./AddItemElementForm";
import {normalizeFertilizer} from "../../../calculator/fertilizer";
import {Elements, FertilizerInfo} from "@/calculator/types";

interface AddItemFertilizerEditFormProps {
  fertilizer?: FertilizerInfo,
  allowEdit?: boolean,
  onChange: (item: FertilizerInfo) => void
}

export const getElements = (f: FertilizerInfo) => {
  return normalizeFertilizer(f, false).elements
}

export const AddItemFertilizerEditForm: FunctionComponent<AddItemFertilizerEditFormProps> = (props) => {
  const {
    fertilizer,
  } = props

  const [elements, setElements] = useState<Elements|undefined>(fertilizer && getElements(fertilizer))

  const onChangeHandler = (el: FERTILIZER_ELEMENT_NAMES, val: number) => {
    if (!elements || !fertilizer){
      return
    }
    props.onChange(fertilizer)
  }

  useEffect(() => {
    setElements(fertilizer && getElements(fertilizer))
  }, [fertilizer])

  return (
    <Flex>
      <Flex>
        {MACRO_ELEMENT_NAMES.map(el => (
          <AddItemElementForm
            disabled={true}
            name={el}
            value={elements?.[el]||0}
            onChange={v => onChangeHandler(el, v)}
          />
        ))}
      </Flex>
    </Flex>
  )
}
