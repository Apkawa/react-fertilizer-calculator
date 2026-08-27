import {
  type FERTILIZER_ELEMENT_NAMES,
  MACRO_ELEMENT_NAMES,
} from "@fertilizer/calculator/constants";
import { normalizeFertilizer } from "@fertilizer/calculator/fertilizer";
import type { Elements } from "@fertilizer/calculator/types";
import React, { type FunctionComponent, useEffect, useState } from "react";
import { Flex } from "rebass";
import type { FertilizerInfo } from "@/components/Calculator/types";
import { AddItemElementForm } from "./AddItemElementForm";

interface AddItemFertilizerEditFormProps {
  fertilizer?: FertilizerInfo;
  allowEdit?: boolean;
  onChange: (item: FertilizerInfo) => void;
}

export const getElements = (f: FertilizerInfo) => {
  return normalizeFertilizer(f, false).elements;
};

export const AddItemFertilizerEditForm: FunctionComponent<AddItemFertilizerEditFormProps> = (
  props,
) => {
  const { fertilizer } = props;

  const [elements, setElements] = useState<Elements | undefined>(
    fertilizer && getElements(fertilizer),
  );

  const onChangeHandler = (el: FERTILIZER_ELEMENT_NAMES, val: number) => {
    if (!elements || !fertilizer) {
      return;
    }
    props.onChange(fertilizer);
  };

  useEffect(() => {
    setElements(fertilizer && getElements(fertilizer));
  }, [fertilizer]);

  return (
    <Flex>
      <Flex>
        {MACRO_ELEMENT_NAMES.map((el) => (
          <AddItemElementForm
            key={el}
            disabled={true}
            name={el}
            value={elements?.[el] || 0}
            onChange={(v) => onChangeHandler(el, v)}
          />
        ))}
      </Flex>
    </Flex>
  );
};
