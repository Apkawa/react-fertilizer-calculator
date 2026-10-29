import { calculateMassParts, parseMolecule } from "@fertilizer/calculator/chem";
import {
  ATOMIC_MASS,
  type AtomNameType,
  FERTILIZER_ELEMENT_NAMES,
} from "@fertilizer/calculator/constants";
import { normalizeFertilizer } from "@fertilizer/calculator/fertilizer";
import type { Elements } from "@fertilizer/calculator/types";
import { Card, Heading, Input, Label, Text } from "@fertilizer/ui";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { entries, round, sum, values } from "@/utils";

import css from "./style.module.css";

type DecomposedChemFormulaInfo = {
  [Atom in AtomNameType]?: {
    count: number;
    mass: number;
    totalMass: number;
    massPart: number;
  };
};

interface Result {
  formula: string;
  decomposed_formula: DecomposedChemFormulaInfo;
  oxide_npk: Elements;
  npk: Elements;
}

function parseFormula(formula: string, percent = 100): Result {
  const f = { id: "", composition: [{ formula, percent }] };
  const molecule = parseMolecule(formula);
  const massParts = calculateMassParts(molecule);
  const p = entries(molecule).map(([a, c]) => [
    a,
    { count: c, mass: ATOMIC_MASS[a], totalMass: c * ATOMIC_MASS[a], massPart: massParts[a] },
  ]);
  const decomposed_formula: DecomposedChemFormulaInfo = Object.fromEntries(p);
  return {
    formula,
    decomposed_formula,
    oxide_npk: normalizeFertilizer(f, false).elements,
    npk: normalizeFertilizer(f, true).elements,
  };
}

export default () => {
  const history = useHistory();
  const { formula = "", percent: initialPercent = "98" } = useParams<{
    formula?: string;
    percent: string;
  }>();
  const [value, setValue] = useState<string>(formula);
  const [percent, setPercent] = useState<number>(parseFloat(initialPercent));
  const [result, setResult] = useState<Result | null>(null);
  const onChangeHandler = (value: string) => {
    setValue(value);
  };
  const onBlurHandler = (value: string) => {
    onChangeHandler(value);
  };

  useEffect(() => {
    setResult(parseFormula(value, percent));
    history.replace(`/formula/${value}/${percent}`);
  }, [history, percent, value]);

  // Верстка — канон макета (guideline §2.2/§3.4/§5): Card-обёртка, заголовок
  // страницы h1 (без override размера), секции h2, таблицы канона (css.table).
  // Ширина — общая рамка Root (max-w 936 px-4), собственного width-контейнера
  // нет. Логика парсинга/роутинга не изменена.
  return (
    <Card>
      <Heading as="h1">Парсер формул</Heading>
      <div className="flex flex-col gap-3">
        {/* Строки полей — канон (§3.4): подпись слева, контрол справа; на узком
            экране контрол переносится на свою строку (flex-wrap) — переполнения
            нет. Touch-высота инпутов — Input-канон (min-height 2.5rem). */}
        <Label className="flex flex-wrap items-center justify-between gap-3">
          Формула
          <Input
            className="min-w-0 grow basis-40"
            aria-label="Формула"
            value={value}
            placeholder={"MgSO4*7H2O"}
            onChange={(event) => onChangeHandler(event.target.value)}
            onBlur={(event) => onBlurHandler(event.target.value)}
          />
        </Label>
        <Label className="flex flex-wrap items-center justify-between gap-3">
          Процент
          <Input
            className="w-24 min-w-0 text-right"
            aria-label="Процент"
            type="number"
            step="0.1"
            min={0}
            max={100}
            value={percent}
            onChange={(event) => setPercent(parseFloat(event.target.value))}
          />
        </Label>
        {result ? (
          <div className="flex flex-col gap-2">
            <Text>
              <b>Формула:</b> {result.formula}
            </Text>
            <div>
              <Heading as="h2">Атомная масса</Heading>
              <table className={css.table}>
                <thead>
                  <tr>
                    <th>Атом</th>
                    <th>Масса</th>
                    <th>Количество</th>
                    <th>Сумма</th>
                    <th>Массовая доля</th>
                  </tr>
                </thead>
                <tbody>
                  {entries(result.decomposed_formula).map(([a, c]) => (
                    <tr key={a}>
                      <th>{a}</th>
                      <td>{c.mass}</td>
                      <td>{c.count}</td>
                      <td>{round(c.totalMass, 2)}</td>
                      <td>{round(c.massPart * 100, 2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <th colSpan={3}>Итого</th>
                    <td>
                      {round(sum(values(result.decomposed_formula).map((c) => c.totalMass)), 2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <Heading as="h2">NPK оксидов</Heading>
              <table className={css.table}>
                <thead>
                  <tr>
                    {FERTILIZER_ELEMENT_NAMES.map((e) => (
                      <th key={e}>{e}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {FERTILIZER_ELEMENT_NAMES.map((e) => (
                      <td key={e}>{result?.oxide_npk[e]}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <Heading as="h2">NPK чистых веществ</Heading>
              <table className={css.table}>
                <thead>
                  <tr>
                    {FERTILIZER_ELEMENT_NAMES.map((e) => (
                      <th key={e}>{e}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {FERTILIZER_ELEMENT_NAMES.map((e) => (
                      <td key={e}>{result?.npk[e]}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
};
