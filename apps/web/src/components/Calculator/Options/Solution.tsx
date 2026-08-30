import { type Concentration, normalizeConcentration } from "@fertilizer/calculator/dilution";
import { Card, Heading, Label, Text } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
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
      <Heading className="text-base">Раствор</Heading>
      <div className="flex flex-col">
        {/* Label оборачивает инпут — связь label/поле неявная (паттерн @fertilizer/ui) */}
        <Label className="flex items-center justify-between">
          Объем, л
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
        </Label>
        {/* Подпись секции: инпуты концентрации стоят ниже */}
        <Label className="flex items-center justify-between pt-2">Концентрация</Label>
        <div className="flex items-center pt-2">
          <Text className="text-[2rem]">1:</Text>
          <StyledInput
            disabled={form?.topping_up_enabled}
            name="solution_concentration.k"
            aria-label="Коэффициент разведения"
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
        </div>
        <div className="flex items-center pt-2">
          Или
          <StyledInput
            disabled={form?.topping_up_enabled}
            name="solution_concentration.v_1"
            aria-label="Миллилитры концентрата"
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
            aria-label="Миллилитры рабочего раствора"
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
        </div>
        <div className="flex items-center justify-between pt-2"></div>
      </div>
    </Card>
  );
};
