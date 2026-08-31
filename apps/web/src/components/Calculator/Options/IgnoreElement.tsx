import { Card, Heading } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
import { Checkbox } from "@/components/ui/Form";

type IgnoreElementProps = {};

export const IgnoreElement: FunctionComponent<IgnoreElementProps> = () => {
  return (
    <Card>
      <div className="flex flex-col">
        <Heading className="text-base">Игнорировать</Heading>
        <Checkbox name="ignore.Ca" label="Кальций" />
        <Checkbox name="ignore.Mg" label="Магний" />
        <Checkbox name="ignore.S" label="Сера" />
        <Checkbox name="ignore.Cl" label="Хлор" />
      </div>
    </Card>
  );
};
