import {
  getConcentrationFromDensity,
  getDensityFromConcentration,
} from "@fertilizer/calculator/density-calculator";
import { DATA_KEYS } from "@fertilizer/calculator/density-calculator/constants";
import { Dropdown, Heading, Input, Label, Text } from "@fertilizer/ui";
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

  return (
    <div className="flex justify-center">
      <div style={{ width: 936 }}>
        <div className="flex">
          <Heading>Калькулятор плотности</Heading>
        </div>
        <div className="flex flex-col gap-2">
          <div style={{ width: 300 }}>
            <Label className="flex flex-col">
              Соль
              <Dropdown items={DATA_KEYS} onChange={onChangeFormula} value={value} />
            </Label>
          </div>
          <Label className="flex flex-col">
            Концентрация
            <Input
              className="w-40"
              type="number"
              step="0.1"
              min={0}
              max={2000}
              value={concentration || 0}
              onChange={(event) => onChangeConcentration(event.target.value)}
            />
            <Text className="whitespace-nowrap">г/л</Text>
          </Label>
          <Label className="flex flex-col">
            Плотность
            <Input
              className="w-40"
              type="number"
              step="0.0001"
              min={0}
              max={2}
              value={density || 0}
              onChange={(event) => onChangeDensity(event.target.value)}
            />
            <Text className="whitespace-nowrap">г/мл</Text>
          </Label>
        </div>
      </div>
    </div>
  );
};
