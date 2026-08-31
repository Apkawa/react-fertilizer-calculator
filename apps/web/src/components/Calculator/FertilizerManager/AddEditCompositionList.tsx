import { Card } from "@fertilizer/ui";
import React from "react";
import { decimal, Input } from "@/components/ui/Form";
import { useStore } from "@/store";

// Контролируемый список строк состава (zustand, вместо FieldArray redux-form):
// читает/пишет массив `composition` глобальной формы по dot-path (composition.<i>.*).
export const AddEditCompositionList = () => {
  const form = useStore((s) => s.fertilizerEdit);
  const { setFertilizerEditField } = useStore.getState();
  const composition = form.composition || [];

  // Новая строка (аналог fields.push)
  const addRow = () => {
    setFertilizerEditField("composition", [...composition, { formula: "", percent: 98 }]);
  };

  // Удаление строки (аналог fields.remove)
  const removeRow = (i: number) => {
    setFertilizerEditField(
      "composition",
      composition.filter((_, idx) => idx !== i),
    );
  };

  return (
    <Card className="w-full">
      <div className="flex">
        <button type="button" onClick={addRow}>
          +
        </button>
      </div>
      <div className="flex flex-col">
        {composition.map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: строки списка позиционные (dot-path по индексу в zustand-сторе) — другого устойчивого id нет
          <div key={i} className="flex w-full">
            <Input name={"composition." + i + ".formula"} flex={2} placeholder={"NH4NO3"} />
            <Input
              name={"composition." + i + ".percent"}
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder={"98"}
              normalize={decimal}
              flex={1}
            />
            <button type="button" onClick={() => removeRow(i)}>
              -
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};
