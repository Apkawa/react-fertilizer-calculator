import { Card, Heading } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
import { Checkbox } from "@/components/ui/Form";

type IgnoreElementProps = {};

export const IgnoreElement: FunctionComponent<IgnoreElementProps> = () => {
  return (
    <Card>
      {/* Заголовок — канон Heading (h2, 1.125rem/600); чекбокс-ряды — канон §3.6:
       * 2 колонки (<800px), 4 колонки (≥800px), gap ≥3; Checkbox из @fertilizer/ui
       * даёт touch-цель ≥40px */}
      <Heading>Игнорировать</Heading>
      <div className="grid grid-cols-2 min-[800px]:grid-cols-4 gap-3">
        <Checkbox name="ignore.Ca" label="Кальций" />
        <Checkbox name="ignore.Mg" label="Магний" />
        <Checkbox name="ignore.S" label="Сера" />
        <Checkbox name="ignore.Cl" label="Хлор" />
      </div>
    </Card>
  );
};
