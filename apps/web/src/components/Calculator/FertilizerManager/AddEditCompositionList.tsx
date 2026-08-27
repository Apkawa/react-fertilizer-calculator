import React from "react";
import { Card, Flex } from "rebass";
import type { FertilizerComposition } from "@/calculator/types";
import { Input } from "@/components/ui/ReduxForm/Input";
import { decimal } from "@/components/ui/ReduxForm/normalizers";
import type { ReduxFieldArrayType } from "@/components/ui/ReduxForm/types";

type AddEditCompositionListProps = {};

type AddEditCompositionListType = ReduxFieldArrayType<
  AddEditCompositionListProps,
  FertilizerComposition
>;
export const AddEditCompositionList: AddEditCompositionListType = (props) => {
  const { fields } = props;
  return (
    <Card width="100%">
      <Flex>
        <button type="button" onClick={() => fields.push({ formula: "", percent: 98 })}>
          +
        </button>
      </Flex>
      <Flex flexDirection="column">
        {fields.map((f, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: поля массива redux-form позиционные (имена по индексу) — другого устойчивого id нет
          <Flex key={i} width="100%">
            <Input name={`${f}.formula`} flex={2} placeholder={"NH4NO3"} />
            <Input
              name={`${f}.percent`}
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder={"98"}
              normalize={decimal}
              flex={1}
            />
            <button type="button" onClick={() => fields.remove(i)}>
              -
            </button>
          </Flex>
        ))}
      </Flex>
    </Card>
  );
};
