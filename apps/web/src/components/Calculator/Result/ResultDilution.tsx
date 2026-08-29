import {
  type DilutionResult,
  dilution_solution,
  normalizeConcentration,
} from "@fertilizer/calculator/dilution";
import { ppmToEC } from "@fertilizer/calculator/helpers";
import { Heading } from "@fertilizer/ui";
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

  let dilution: DilutionResult[] | null = null;

  dilution = dilution_solution(
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
    <>
      <div className="flex w-3/4 flex-col">
        <Heading className="text-base">Разбавление</Heading>
        <ul>
          {dilution.map((d) => (
            <li key={d.id}>
              Раствор {d.id} - {d.volume < 1 ? `${d.volume * 1000}мл` : `${d.volume}л`}
            </li>
          ))}
          <li>Долить до {solution_volume}л</li>
          <li>
            <b>TDS:</b> {newPpm} ppm; <b>EC:</b> {ppmToEC(newPpm, 1)} мСм/см
          </li>
        </ul>
      </div>
    </>
  );
}
