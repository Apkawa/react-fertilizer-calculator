import {
  type DilutionResult,
  dilution_solution,
  normalizeConcentration,
} from "@fertilizer/calculator/dilution";
import { ppmToEC } from "@fertilizer/calculator/helpers";
import { Chip, Heading, Text } from "@fertilizer/ui";
import React from "react";
import { useFertilizerSolutionGroup, usePPM } from "@/components/Calculator/Result/hooks";
import type { CalculatorFormValues } from "@/components/Calculator/types";
import { useStore } from "@/store";
import { round } from "@/utils";

type DilutionResultProps = {};

export function ResultDilution(props: DilutionResultProps) {
  // Форма расчёта (null-safe): дефолты совпадают с дефолтами initialValues redux-form
  const form = useStore((s) => s.calculator.calculationForm);
  const {
    dilution_enabled,
    solution_concentration = normalizeConcentration(1),
    solution_volume = 1,
    dilution_concentration = normalizeConcentration(1),
  } = (form ?? {}) as CalculatorFormValues;

  const fertilizerWeightGroups = useFertilizerSolutionGroup();
  const ppm = usePPM();

  if (!dilution_enabled) {
    return null;
  }

  const dilution_con = normalizeConcentration(dilution_concentration);

  const newPpm = round((dilution_con.k * ppm) / solution_concentration.k);

  const dilution: DilutionResult[] = dilution_solution(
    {
      id: "Total",
      volume: solution_volume,
      concentration: solution_concentration,
    },
    fertilizerWeightGroups.map(([g]) => ({
      id: g,
      concentration: dilution_con,
    })),
  );

  return (
    <div className="mt-4 flex flex-col gap-2">
      {/* Подраздел карточки — канон §5: Heading без легасного text-base */}
      <Heading>Разбавление</Heading>
      {/* Строки разбавления по канону ряда (§3.4): field-label слева —
       * 0.75rem muted (§5), значение справа — text-sm semibold; кастомных
       * фонов и custom-width нет. Значения — из данных dilution_solution. */}
      <div className="flex flex-col gap-1">
        {dilution.map((d) => (
          <div key={d.id} className="flex items-baseline gap-2">
            <Text className="min-w-0 flex-1 text-xs text-[var(--muted)]">Раствор {d.id}</Text>
            <Text className="shrink-0 text-sm font-semibold">
              {d.volume < 1 ? `${d.volume * 1000} мл` : `${d.volume} л`}
            </Text>
          </div>
        ))}
        <div className="flex items-baseline gap-2">
          <Text className="min-w-0 flex-1 text-xs text-[var(--muted)]">Долить до</Text>
          <Text className="shrink-0 text-sm font-semibold">{solution_volume} л</Text>
        </div>
        {/* Итоги разбавления — канон чипов §3.2 (plain), значения из данных */}
        <div className="flex flex-nowrap items-center gap-2">
          <Chip label="TDS" value={`${newPpm} ppm`} />
          <Chip label="EC" value={`${ppmToEC(newPpm, 1)} мСм/см`} />
        </div>
      </div>
    </div>
  );
}
