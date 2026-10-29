import { Card, Label } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
import { Checkbox, decimal, Input, number } from "@/components/ui/Form";
import { useStore } from "@/store";

type ToppingUpProps = {};

export const ToppingUp: FunctionComponent<ToppingUpProps> = () => {
  const form = useStore((s) => s.calculator.calculationForm);
  const topping_up_enabled = form?.topping_up_enabled;
  return (
    <Card>
      <Checkbox name="topping_up_enabled" label="Долив раствора" />
      {/* Блок показывается по чекбоксу — аккордеон (§3.6): поля скрыты без галочки */}
      {topping_up_enabled ? (
        <div className="flex flex-col gap-3">
          {/* Строки полей — канон макета (§3.4): подпись слева, поле справа с
           * фиксированной шириной и text-right, gap ≥3; Label оборачивает инпут —
           * связь label/поле неявная (паттерн @fertilizer/ui). */}
          <Label className="flex flex-wrap items-center justify-between gap-3">
            Новый объем, л
            <Input
              name="topping_up.newSolution.volume"
              className="w-24 min-w-0 text-right"
              type="number"
              step="0.1"
              min="1"
              pattern="^\d+$"
              normalize={number}
              required
              autoComplete="off"
            />
          </Label>
          <Label className="flex flex-wrap items-center justify-between gap-3">
            Текущий объем, л
            <Input
              name="topping_up.currentSolution.volume"
              className="w-24 min-w-0 text-right"
              type="number"
              step="0.1"
              min="1"
              pattern="^\d+$"
              normalize={number}
              autoComplete="off"
            />
          </Label>
          <Label className="flex flex-wrap items-center justify-between gap-3">
            Текущий EC, мСм/см
            <Input
              name="topping_up.currentSolution.EC"
              className="w-24 min-w-0 text-right"
              type="number"
              step="0.01"
              min="0"
              max="10"
              normalize={decimal}
              autoComplete="off"
            />
          </Label>
          <Label className="flex flex-wrap items-center justify-between gap-3">
            EC профиля раствора, мСм/см
            <Input
              name="topping_up.currentSolution.profileEC"
              className="w-24 min-w-0 text-right"
              type="number"
              step="0.01"
              min="0"
              max="10"
              normalize={decimal}
              autoComplete="off"
            />
          </Label>
          {/* Длинная подпись — поле шире (w-28, как ряд солей в каноне макета) */}
          <Label className="flex flex-wrap items-center justify-between gap-3">
            Концентрация солей профиля раствора, г/л
            <Input
              name="topping_up.currentSolution.profileSaltsConcentration"
              className="w-28 min-w-0 text-right"
              type="number"
              step="0.01"
              min="0"
              max="10"
              normalize={decimal}
              autoComplete="off"
            />
          </Label>
        </div>
      ) : null}
    </Card>
  );
};
