import { Label } from "@rebass/forms";
import React, { type FunctionComponent } from "react";
import { Card, Flex } from "rebass";
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
        <Flex flexDirection="column" style={{ display: topping_up_enabled ? "flex" : "none" }}>
          <Flex alignItems="center" justifyContent="space-between">
            <Label htmlFor="topping_up.newSolution.volume">Новый объем, л</Label>
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
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Label htmlFor="topping_up.currentSolution.volume">Текущий объем, л</Label>
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
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" paddingTop={2}>
            <Label htmlFor="topping_up.currentSolution.EC">Текущий EC, мСм/см</Label>
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
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" paddingTop={2}>
            <Label htmlFor="topping_up.currentSolution.profileEC">
              EC профиля раствора, мСм/см
            </Label>
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
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" paddingTop={2}>
            <Label htmlFor="topping_up.currentSolution.profileSaltsConcentration">
              Концентрация солей профиля раствора, г/л
            </Label>
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
          </Flex>
        </Flex>
      ) : null}
    </Card>
  );
};
