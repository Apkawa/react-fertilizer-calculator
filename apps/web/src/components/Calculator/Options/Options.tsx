import { Button } from "@fertilizer/ui";
import React, { type ComponentType } from "react";
import { Accuracy } from "./Accuracy";
import { Dilution } from "./Dilution";
import { IgnoreElement } from "./IgnoreElement";
import { Solution } from "./Solution";
import { ToppingUp } from "./ToppingUp";

type OptionsProps = {};

// Колонка карточек опций — канон content column (§2.2): стек карточек с единым
// gap-2; поведение и порядок секций легасные (не меняются).
export const Options: ComponentType<OptionsProps> = () => {
  return (
    <div className="flex flex-col gap-2">
      {/* Кнопка расчёта — канон ui Button (§3.1), на всю ширину колонки */}
      <Button className="w-full" type="submit">
        Calculate
      </Button>
      <Solution />
      <ToppingUp />
      <Dilution />
      <IgnoreElement />
      <Accuracy />
    </div>
  );
};
