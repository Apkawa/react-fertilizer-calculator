import type { FertilizerWeights } from "@fertilizer/calculator";
import { Text } from "@fertilizer/ui";
import React from "react";
import { useStore } from "@/store";
import { countDecimals, round } from "@/utils";

interface ResultFertilizerListProps {
  fertilizers: FertilizerWeights[];
}

export function ResultFertilizerList(props: ResultFertilizerListProps) {
  const { fertilizers } = props;
  // Точность из формы (null-safe; дефолт формы — 0.2)
  const accuracy = useStore((s) => s.calculator.calculationForm?.accuracy);
  return (
    // Семантический список вывода расчёта (ul/li) — канон ряда §3.5 не
    // мешает: preflight снимает маркеры, ряд — flex-строка.
    <ul className="flex flex-col gap-1">
      {fertilizers.map((f) => (
        // Строка списка — канон ряда §3.5 (без grip/checkbox/edit — это вывод
        // расчёта): name → вес → объём раствора. Типографика §5: имя и вес —
        // text-sm semibold (.fert-name/.fert-weight макета), объём —
        // второстепенный 0.75rem muted. Кастомные фоны/литералы цвета нет.
        <li key={f.id} className="flex flex-wrap items-baseline gap-2">
          <Text className="min-w-0 flex-1 text-sm font-semibold">{f.id}</Text>
          <Text className="shrink-0 text-sm font-semibold">
            {round(f.weight, countDecimals(accuracy ?? 0.2))} г
          </Text>
          {f.volume ? (
            <Text className="shrink-0 text-xs text-[var(--muted)]" title="Объем или вес раствора">
              {`${f.volume} мл${f.liquid_weight ? `, ${f.liquid_weight} г` : ""}`}
            </Text>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
