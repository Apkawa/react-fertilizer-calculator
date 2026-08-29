import { IconButton } from "@fertilizer/icons";
import { Dropdown } from "@fertilizer/ui";
import React, { type FunctionComponent, useState } from "react";
import { Box, Card, Flex } from "rebass";
import { useStore } from "@/store";
import type { FertilizerType } from "./types";

interface AddItemProps {
  onAdd: (item: FertilizerType) => void;
}

export const AddItem: FunctionComponent<AddItemProps> = ({ onAdd }) => {
  // Состояние калькулятора из zustand-стора (замена useSelector).
  const { fertilizers, calculationForm } = useStore((s) => s.calculator);

  const [selected, setSelected] = useState<FertilizerType | undefined>(fertilizers[0]);

  const selectedFertilizers = calculationForm?.fertilizers || [];
  const fertilizersIDs = selectedFertilizers.map((f) => f?.id);

  const onChangeHandler = (item: FertilizerType | null) => {
    item && setSelected(item);
  };

  const onAddHandler = (item: FertilizerType) => {
    onAdd(item);
  };
  return (
    <Card>
      <Flex flexDirection="column">
        <Flex justifyContent="space-between">
          <Box flex={1} pr={2}>
            <Dropdown<FertilizerType>
              value={selected}
              items={fertilizers}
              onChange={onChangeHandler}
              checkDisabledItem={(item) => fertilizersIDs.includes(item?.id || "")}
              renderItem={({ item }) => (
                <Flex flex={1} justifyContent="space-between">
                  <Box>{item.id}</Box>
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation();
                      onAddHandler(item);
                    }}
                    name="plus"
                  />
                </Flex>
              )}
              renderValue={(item) => item?.id || ""}
            />
          </Box>
        </Flex>
      </Flex>
    </Card>
  );
};
