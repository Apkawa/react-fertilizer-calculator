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
      <Heading>Раствор</Heading>
      {/* Строки полей — канон макета (§3.4): подпись слева (flex-1), поле справа
       * с фиксированной шириной и text-right, gap ≥3; label оборачивает инпут —
       * связь label/поле неявная (паттерн @fertilizer/ui). */}
      <div className="grid grid-cols-2 gap-3">
        <Label className="flex flex-wrap items-center justify-between gap-3">
          Объем, л
          <Input
            disabled={form?.topping_up_enabled}
            name="solution_volume"
            className="w-24 min-w-0 text-right"
            type="number"
            step="0.05"
            min="0.1"
            max="100"
            normalize={decimal}
            autoComplete="off"
          />
        </Label>
        <Label className="flex flex-wrap items-center justify-between gap-3">
          Концентрация
          {/* Префикс «1:» — внутри строки поля (канон §3.4), не отдельный ряд;
           * без shrink-0 группа переносится на узком экране (нет переполнения). */}
          <span className="flex items-center gap-1">
            <Text className="text-sm text-[var(--muted)]">1:</Text>
            <StyledInput
              disabled={form?.topping_up_enabled}
              name="solution_concentration.k"
              aria-label="Коэффициент разведения"
              className="w-24 min-w-0 text-right"
              type="number"
              step="0.01"
              min="1"
              max="1000"
              autoComplete="off"
              value={form?.solution_concentration?.k ?? ""}
              onChange={onChange("k")}
            />
          </span>
        </Label>
      </div>
      {/* Inline-альтернатива — канон (§3.4): «Или [v_1] мл на [v_2] мл рабочего раствора» */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
        <span>Или</span>
        <StyledInput
          disabled={form?.topping_up_enabled}
          name="solution_concentration.v_1"
          aria-label="Миллилитры концентрата"
          className="w-20 min-w-0 text-right"
          type="number"
          step="0.01"
          min="1"
          autoComplete="off"
          value={form?.solution_concentration?.v_1 ?? ""}
          onChange={onChange("v_1")}
        />
        <span>мл на</span>
        <StyledInput
          disabled={form?.topping_up_enabled}
          name="solution_concentration.v_2"
          aria-label="Миллилитры рабочего раствора"
          className="w-24 min-w-0 text-right"
          type="number"
          step="0.01"
          min="0"
          autoComplete="off"
          value={form?.solution_concentration?.v_2 ?? ""}
          onChange={onChange("v_2")}
        />
        <span>мл рабочего раствора</span>
      </div>
    </Card>
  );
};
