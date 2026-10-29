import {
  getConcentrationFromDensity,
  getDensityFromConcentration,
} from "@fertilizer/calculator/density-calculator";
import { DATA_KEYS } from "@fertilizer/calculator/density-calculator/constants";
import { Card, Dropdown, Heading, Input, Label } from "@fertilizer/ui";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { round } from "@/utils";

interface RouterParams {
  formula?: string;
  density?: string;
  concentration?: string;
}

export default () => {
  const history = useHistory();
  const params = useParams<RouterParams>();
  const [value, setValue] = useState<string | null>(params.formula || null);
  const [density, setDensity] = useState<number | null>(
    params.density ? parseFloat(params.density) : null,
  );
  const [concentration, setConcentration] = useState<number | null>(
    params.concentration ? parseFloat(params.concentration) : null,
  );

  const onChangeFormula = (v: string | null) => {
    setValue(v);
    if (v && DATA_KEYS.includes(v as DATA_KEYS) && density) {
      const c = round(getConcentrationFromDensity(v as DATA_KEYS, density), 1);
      if (c !== concentration) {
        setConcentration(c);
      }
    }
  };

  const onChangeConcentration = (v: string) => {
    const c = parseFloat(v);
    setConcentration(c);
    if (value && DATA_KEYS.includes(value as DATA_KEYS) && c) {
      const d = round(getDensityFromConcentration(value as DATA_KEYS, c), 4);
      if (d !== density) {
        setDensity(d);
      }
    }
  };

  const onChangeDensity = (v: string) => {
    const d = parseFloat(v);
    setDensity(d);
    if (value && DATA_KEYS.includes(value as DATA_KEYS) && d) {
      const c = round(getConcentrationFromDensity(value as DATA_KEYS, d), 1);
      if (c !== concentration) {
        setConcentration(c);
      }
    }
  };

  useEffect(() => {
    if (DATA_KEYS.includes(value as DATA_KEYS)) {
      history.replace(`/density/${value}/${concentration}/${density}`);
    } else {
      history.replace(`/density/`);
    }
  }, [history, value, density, concentration]);

  // Верстка — канон макета (guideline §2.2/§3.4/§5): Card-обёртка, заголовок
  // страницы h1, строки полей «подпись слева / контрол справа» с единицами в
  // подписи (§5: «Концентрация, г/л», «Плотность, г/мл»). Ширина — общая рамка
  // Root; легасный inline width: 936/300 убран (на 390px давал переполнение).
  // Логика пересчёта плотности/концентрации и роутинга не изменена.
  return (
    <Card>
      <Heading as="h1">Калькулятор плотности</Heading>
      {/* На узком экране контрол переносится на свою строку (flex-wrap),
          touch-высота — канон контролов (2.5rem). */}
      <div className="flex flex-col gap-3">
        <Label className="flex flex-wrap items-center justify-between gap-3">
          Соль
          {/* Dropdown не принимает className — обёртка даёт ширину без
              inline-стилей (width-проп создавал style-атрибут). */}
          <span className="flex min-w-0 grow basis-40 justify-end">
            <Dropdown items={DATA_KEYS} onChange={onChangeFormula} value={value} label="Соль" />
          </span>
        </Label>
        <Label className="flex flex-wrap items-center justify-between gap-3">
          Концентрация, г/л
          <Input
            className="w-24 min-w-0 text-right"
            type="number"
            step="0.1"
            min={0}
            max={2000}
            value={concentration || 0}
            onChange={(event) => onChangeConcentration(event.target.value)}
          />
        </Label>
        <Label className="flex flex-wrap items-center justify-between gap-3">
          Плотность, г/мл
          <Input
            className="w-24 min-w-0 text-right"
            type="number"
            step="0.0001"
            min={0}
            max={2}
            value={density || 0}
            onChange={(event) => onChangeDensity(event.target.value)}
          />
        </Label>
      </div>
    </Card>
  );
};
