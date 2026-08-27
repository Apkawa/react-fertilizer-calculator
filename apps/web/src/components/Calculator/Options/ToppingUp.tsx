import { Label } from "@rebass/forms";
import React, { type FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Card, Flex } from "rebass";
import { getFormValues } from "redux-form";
import { REDUX_FORM_NAME } from "@/components/Calculator/constants";
import type { CalculatorFormValues } from "@/components/Calculator/types";
import { Checkbox } from "@/components/ui/ReduxForm/Checkbox";
import { Input } from "@/components/ui/ReduxForm/Input";
import { decimal, number } from "@/components/ui/ReduxForm/normalizers";

type ToppingUpProps = {};

export const ToppingUp: FunctionComponent<ToppingUpProps> = () => {
  const { topping_up_enabled } = useSelector(
    getFormValues(REDUX_FORM_NAME),
  ) as CalculatorFormValues;
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
