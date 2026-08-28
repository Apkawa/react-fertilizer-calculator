import { type Concentration, normalizeConcentration } from "@fertilizer/calculator/dilution";
import { Label } from "@rebass/forms";
import React, { type FunctionComponent } from "react";
import { Card, Flex, Heading, Text } from "rebass";
import { decimal, Input, StyledInput } from "@/components/ui/Form";
import { useStore } from "@/store";

type SolutionVolumeProps = {};

export const Solution: FunctionComponent<SolutionVolumeProps> = () => {
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
      newCon = { ...form?.solution_concentration, [field]: k };
      delete newCon.k;
    }
    const newConcentration = normalizeConcentration(newCon);
    setFieldValue("solution_concentration", newConcentration);
  };
  return (
    <Card>
      <Heading fontSize={2}>Раствор</Heading>
      <Flex flexDirection="column">
        <Flex alignItems="center" justifyContent="space-between">
          <Label htmlFor="solution_volume">Объем, л</Label>
          <Input
            disabled={form?.topping_up_enabled}
            name="solution_volume"
            width="4rem"
            type="number"
            step="0.05"
            min="0.1"
            max="100"
            normalize={decimal}
            style={{
              textAlign: "center",
            }}
            autoComplete="off"
          />
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" paddingTop={2}>
          <Label htmlFor="solution_concentration.k">Концентрация</Label>
        </Flex>
        <Flex alignItems="center" paddingTop={2}>
          <Text fontSize={"2rem"}>1:</Text>
          <StyledInput
            disabled={form?.topping_up_enabled}
            name="solution_concentration.k"
            type="number"
            step="0.01"
            width={"auto"}
            min="1"
            max="1000"
            style={{
              textAlign: "center",
            }}
            autoComplete="off"
            value={form?.solution_concentration?.k ?? ""}
            onChange={onChange("k")}
          />
        </Flex>
        <Flex alignItems={"center"} paddingTop={2}>
          Или
          <StyledInput
            disabled={form?.topping_up_enabled}
            name="solution_concentration.v_1"
            width="4rem"
            type="number"
            step="0.01"
            min="1"
            style={{
              textAlign: "center",
            }}
            autoComplete="off"
            value={form?.solution_concentration?.v_1 ?? ""}
            onChange={onChange("v_1")}
          />{" "}
          мл на
          <StyledInput
            disabled={form?.topping_up_enabled}
            name="solution_concentration.v_2"
            width="4rem"
            type="number"
            step="0.01"
            min="0"
            style={{
              textAlign: "center",
            }}
            autoComplete="off"
            value={form?.solution_concentration?.v_2 ?? ""}
            onChange={onChange("v_2")}
          />{" "}
          мл рабочего раствора
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" paddingTop={2}></Flex>
      </Flex>
    </Card>
  );
};
