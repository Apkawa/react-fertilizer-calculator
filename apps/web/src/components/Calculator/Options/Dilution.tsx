import { type Concentration, normalizeConcentration } from "@fertilizer/calculator/dilution";
import { Label } from "@rebass/forms";
import React, { type FunctionComponent } from "react";
import { Card, Flex, Text } from "rebass";
import { Checkbox, Input, number, StyledInput } from "@/components/ui/Form";
import { useStore } from "@/store";

type DilutionProps = {};

export const Dilution: FunctionComponent<DilutionProps> = () => {
  const form = useStore((s) => s.calculator.calculationForm);
  const { setFieldValue } = useStore.getState();

  const onChange = (field: string) => (event: any) => {
    if (!event.target.value) {
      return;
    }
    const k = parseFloat(event.target.value);

    let newCon: Partial<Concentration> = {};
    if (field === "k") {
      newCon.k = k;
    } else {
      newCon = { ...(form?.dilution_concentration ?? {}), [field]: k };
      delete newCon.k;
    }
    const newConcentration = normalizeConcentration(newCon);
    setFieldValue("dilution_concentration", newConcentration);
  };
  return (
    <Card>
      <Checkbox name="dilution_enabled" label="Разбавление концентрата" />
      <Flex flexDirection="column" style={{ display: form?.dilution_enabled ? "flex" : "none" }}>
        <Flex alignItems="center" justifyContent="space-between">
          <Label htmlFor="dilution_volume">Объем, л</Label>
          <Input
            name="dilution_volume"
            width="3rem"
            type="number"
            step="1"
            min="1"
            pattern="^\d+$"
            normalize={number}
            style={{
              textAlign: "center",
            }}
            autoComplete="off"
          />
        </Flex>
        <Flex>
          <Label htmlFor="dilution_concentration.k">Концентрация</Label>
        </Flex>
        <Flex alignItems="center" paddingTop={2}>
          <Text fontSize={"2rem"}>1:</Text>
          <StyledInput
            name="dilution_concentration.k"
            type="number"
            width={"auto"}
            step="0.1"
            min="1"
            max="2000"
            style={{
              textAlign: "center",
            }}
            autoComplete="off"
            value={form?.dilution_concentration?.k ?? ""}
            onChange={onChange("k")}
          />
        </Flex>
        <Flex alignItems={"center"}>
          Или
          <StyledInput
            name="dilution_concentration.v_1"
            type="number"
            width={"4rem"}
            step="0.1"
            min="0"
            max="50000"
            style={{
              textAlign: "center",
            }}
            autoComplete="off"
            value={form?.dilution_concentration?.v_1 ?? ""}
            onChange={onChange("v_1")}
          />
          мл на
          <StyledInput
            name="dilution_concentration.v_2"
            type="number"
            width={"4rem"}
            step="1"
            min="0"
            max="1000000"
            style={{
              textAlign: "center",
            }}
            autoComplete="off"
            value={form?.dilution_concentration?.v_2 ?? ""}
            onChange={onChange("v_2")}
          />
          мл. рабочего раствора
        </Flex>
      </Flex>
    </Card>
  );
};
