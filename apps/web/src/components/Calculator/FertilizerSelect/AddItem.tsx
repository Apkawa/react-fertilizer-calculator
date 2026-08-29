import { IconButton } from "@fertilizer/icons";
import { Card, Dropdown } from "@fertilizer/ui";
import React, { type FunctionComponent, useState } from "react";
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
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="flex-1 pr-2">
            <Dropdown<FertilizerType>
              value={selected}
              items={fertilizers}
              onChange={onChangeHandler}
              checkDisabledItem={(item) => fertilizersIDs.includes(item?.id || "")}
              renderItem={({ item }) => (
                <div className="flex flex-1 justify-between">
                  <div>{item.id}</div>
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation();
                      onAddHandler(item);
                    }}
                    name="plus"
                  />
                </div>
              )}
              renderValue={(item) => item?.id || ""}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
