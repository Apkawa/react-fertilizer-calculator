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
      {topping_up_enabled ? (
        // Блок показывается по чекбоксу: display из стора оставляем в style
        <div className="flex flex-col" style={{ display: topping_up_enabled ? "flex" : "none" }}>
          {/* Label оборачивает инпут — связь label/поле неявная (паттерн @fertilizer/ui) */}
          <Label className="flex items-center justify-between">
            Новый объем, л
            <Input
              name="topping_up.newSolution.volume"
              width="3rem"
              type="number"
              step="0.1"
              min="1"
              pattern="^\d+$"
              normalize={number}
              required
              style={{
                textAlign: "center",
              }}
              autoComplete="off"
            />
          </Label>
          <Label className="flex items-center justify-between">
            Текущий объем, л
            <Input
              name="topping_up.currentSolution.volume"
              width="3rem"
              type="number"
              step="0.1"
              min="1"
              pattern="^\d+$"
              normalize={number}
              style={{
                textAlign: "center",
              }}
              autoComplete="off"
            />
          </Label>
          <Label className="flex items-center justify-between pt-2">
            Текущий EC, мСм/см
            <Input
              name="topping_up.currentSolution.EC"
              width="3rem"
              type="number"
              step="0.01"
              min="0"
              max="10"
              normalize={decimal}
              style={{
                textAlign: "center",
              }}
              autoComplete="off"
            />
          </Label>
          <Label className="flex items-center justify-between pt-2">
            EC профиля раствора, мСм/см
            <Input
              name="topping_up.currentSolution.profileEC"
              width="3rem"
              type="number"
              step="0.01"
              min="0"
              max="10"
              normalize={decimal}
              style={{
                textAlign: "center",
              }}
              autoComplete="off"
            />
          </Label>
          <Label className="flex items-center justify-between pt-2">
            Концентрация солей профиля раствора, г/л
            <Input
              name="topping_up.currentSolution.profileSaltsConcentration"
              width="3rem"
              type="number"
              step="0.01"
              min="0"
              max="10"
              normalize={decimal}
              style={{
                textAlign: "center",
              }}
              autoComplete="off"
            />
          </Label>
        </div>
      ) : null}
    </Card>
  );
};
