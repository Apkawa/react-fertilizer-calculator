import React from "react";
import {Flex} from "rebass";
import {SelectedListItem} from "./SelectedListItem";
import {AddItem} from "./AddItem";
import {ReduxFieldArrayType} from "../../ui/ReduxForm/types";
import {FertilizerType} from "./types";
import {CalculatorFormValues, CalculatorState} from "../types";
import {useFormValues} from "../../../hooks/ReduxForm";
import {useSelector} from "react-redux";

interface SelectedListProps {
}

export const SelectedList: ReduxFieldArrayType<SelectedListProps, FertilizerType> = (
  {fields, meta: {error}}) => {
  const values = useFormValues<CalculatorFormValues>()[0]
  const fertilizers = values.fertilizers;
  const {
    result,
  } = useSelector<any>(state => state.calculator) as CalculatorState

  const calculatedFertilizersWeights = Object.fromEntries((result?.fertilizers || []).map(f => [f.id, f.base_weight]))

  const onAddHandler = (item: FertilizerType) => {
    for (let f of fertilizers) {
      if (f.id === item.id) {
        return
      }
    }
    fields.push(item)
  }
  return (
    <Flex sx={{flexDirection: 'column'}} width='auto'>
      <AddItem onAdd={onAddHandler}/>
      <Flex sx={{
        flexDirection: 'column',
        '& > *': {
          marginTop: '8px !important',
        }
      }}>
        {error ? <span>{error}</span> : null}
        {fertilizers.map((item, index) =>
          <SelectedListItem
            item={item}
            key={item.id}
            needWeight={calculatedFertilizersWeights[item.id]}
            onRemove={() => fields.remove(index)}
          />
        )}
      </Flex>
    </Flex>
  )
}
