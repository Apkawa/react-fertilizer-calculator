import React from "react";
import { useStore } from "@/store";
import { AddItem } from "./AddItem";
import { SelectedListItem } from "./SelectedListItem";
import type { FertilizerType } from "./types";

// Контроллируемый список выбранных удобрений: состояние и запись — из zustand-стора
// (замена redux-form FieldArray + syncErrors).
export const SelectedList = () => {
  const form = useStore((s) => s.calculator.calculationForm);
  const result = useStore((s) => s.calculator.result);
  const fertilizersError = useStore((s) => s.fertilizersError);
  const { setFieldValue } = useStore.getState();

  const fertilizers = form?.fertilizers || [];

  const calculatedFertilizersWeights = Object.fromEntries(
    (result?.fertilizers || []).map((f) => [f.id, f]),
  );

  // Добавление с дедупликацией по id (замена fields.push)
  const onAddHandler = (item: FertilizerType) => {
    for (const f of fertilizers) {
      if (f.id === item.id) {
        return;
      }
    }
    setFieldValue("fertilizers", [...fertilizers, item]);
  };

  const onRemove = (index: number) => {
    setFieldValue(
      "fertilizers",
      fertilizers.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="flex w-auto flex-col">
      <AddItem onAdd={onAddHandler} />
      {/* Верхний отступ у всех дочерних элементов (marginTop у children) */}
      <div className="flex flex-col [&>*]:mt-2">
        {fertilizersError ? <span>{fertilizersError}</span> : null}
        {fertilizers.map((item, index) => (
          <SelectedListItem
            item={item}
            key={item.id}
            weight={calculatedFertilizersWeights[item.id]}
            onRemove={() => onRemove(index)}
          />
        ))}
      </div>
    </div>
  );
};
