import type { FertilizerWeights } from "@fertilizer/calculator";
import { FERTILIZER_ELEMENT_NAMES, NPKOxides } from "@fertilizer/calculator/constants";
import { normalizeFertilizer } from "@fertilizer/calculator/fertilizer";
import type { Elements } from "@fertilizer/calculator/types";
import { IconButton } from "@fertilizer/icons";
import { Card, Text } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
import type { FertilizerType } from "./types";

// Фоновые цвета чипов элементов (были токенами bg={name} из легасной темы)
const ELEMENT_BG: Partial<Record<FERTILIZER_ELEMENT_NAMES, string>> = {
  NO3: "#05AD11",
  NH4: "#FFF",
  P: "#DBC403",
  K: "#E07206",
  Ca: "#D1C7C7",
  Mg: "#AB0AE0",
  S: "#FFF",
};

interface ElementProps {
  name: keyof Elements;
  isOxide?: boolean;
  value: number;
  delta?: number;
}

export const Element: FunctionComponent<ElementProps> = (props) => {
  const { name, value, delta, isOxide } = props;
  let displayName: string = name;
  if (isOxide && Object.hasOwn(NPKOxides, name)) {
    displayName = NPKOxides[name] as string;
  }
  return (
    <div
      className="flex-1 mx-[2px] min-w-[2.1em] max-w-[4em] px-1 text-sm text-black"
      style={{ backgroundColor: ELEMENT_BG[name] }}
    >
      <div className="flex flex-col items-center">
        <div>{displayName}</div>
        <div>{value}</div>
        {typeof delta !== "undefined" ? <div>{delta}</div> : null}
      </div>
    </div>
  );
};

interface SelectedListItemProps {
  item: FertilizerType;
  onRemove: () => void;
  weight?: FertilizerWeights;
}

export const SelectedListItem: FunctionComponent<SelectedListItemProps> = ({
  item,
  onRemove,
  weight,
}) => {
  const normalizedFertilizer = normalizeFertilizer(item, false);
  return (
    <Card className="w-auto">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Text className="flex-1">{item.id}</Text>
          <div className="flex">
            {FERTILIZER_ELEMENT_NAMES.map((name) => {
              const v = normalizedFertilizer.elements[name];
              if (!v) {
                return null;
              }
              return <Element name={name} key={name} value={v} isOxide />;
            })}
          </div>
        </div>
        <div className="flex">
          <div className="flex m-1 items-center justify-center">
            {weight ? (
              <Text className="min-w-[3em] text-center">
                {weight.weight}г
                {weight.volume ? (
                  <>
                    <br />
                    <span title="Объем или вес раствора">
                      {weight.volume &&
                        `${weight.volume} мл${weight.liquid_weight ? `, ${weight.liquid_weight}г` : ""}`}
                    </span>
                  </>
                ) : null}
              </Text>
            ) : null}
          </div>
          <IconButton padding={1} alignSelf="center" name="close" onClick={() => onRemove()} />
        </div>
      </div>
    </Card>
  );
};
