import { type Concentration, normalizeConcentration } from "@fertilizer/calculator/dilution";
import { Card, Label, Text } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
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
      {/* Блок показывается по чекбоксу: display из стора оставляем в style */}
      <div
        className="flex flex-col gap-3"
        style={{ display: form?.dilution_enabled ? "flex" : "none" }}
      >
        {/* Строки полей — канон макета (§3.4): подпись слева, поле справа с
         * фиксированной шириной и text-right, gap ≥3; Label оборачивает инпут —
         * связь label/поле неявная (паттерн @fertilizer/ui). */}
        <Label className="flex flex-wrap items-center justify-between gap-3">
          Объем, л
          <Input
            name="dilution_volume"
            className="w-24 min-w-0 text-right"
            type="number"
            step="1"
            min="1"
            pattern="^\d+$"
            normalize={number}
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
              name="dilution_concentration.k"
              aria-label="Коэффициент разведения"
              className="w-24 min-w-0 text-right"
              type="number"
              step="0.1"
              min="1"
              max="2000"
              autoComplete="off"
              value={form?.dilution_concentration?.k ?? ""}
              onChange={onChange("k")}
            />
          </span>
        </Label>
        {/* Inline-альтернатива — канон (§3.4): «Или [v_1] мл на [v_2] мл.рабочего раствора» */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
          <span>Или</span>
          <StyledInput
            name="dilution_concentration.v_1"
            aria-label="Миллилитры концентрата"
            className="w-16 min-w-0 text-right"
            type="number"
            step="0.1"
            min="0"
            max="50000"
            autoComplete="off"
            value={form?.dilution_concentration?.v_1 ?? ""}
            onChange={onChange("v_1")}
          />
          <span>мл на</span>
          <StyledInput
            name="dilution_concentration.v_2"
            aria-label="Миллилитры рабочего раствора"
            className="w-16 min-w-0 text-right"
            type="number"
            step="1"
            min="0"
            max="1000000"
            autoComplete="off"
            value={form?.dilution_concentration?.v_2 ?? ""}
            onChange={onChange("v_2")}
          />
          <span>мл.рабочего раствора</span>
        </div>
      </div>
    </Card>
  );
};
