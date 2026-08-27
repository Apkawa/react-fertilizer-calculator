import type { FertilizerWeights } from "@fertilizer/calculator";
import { FERTILIZER_ELEMENT_NAMES, NPKOxides } from "@fertilizer/calculator/constants";
import { normalizeFertilizer } from "@fertilizer/calculator/fertilizer";
import type { Elements } from "@fertilizer/calculator/types";
import { IconButton } from "@fertilizer/icons";
import React, { type FunctionComponent } from "react";
import { Box, Card, Flex, Text } from "rebass";
import type { FertilizerType } from "./types";

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
    <Box
      bg={name}
      flex={1}
      mx="2px"
      px={1}
      color={"black"}
      minWidth="2.1em"
      maxWidth="4em"
      fontSize={1}
    >
      <Flex flexDirection="column" alignItems={"center"}>
        <Box>{displayName}</Box>
        <Box>{value}</Box>
        {typeof delta !== "undefined" ? <Box>{delta}</Box> : null}
      </Flex>
    </Box>
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
    <Card width={"auto"}>
      <Flex justifyContent={"space-between"} alignItems="center">
        <Box flex={1}>
          <Text flex={1}>{item.id}</Text>
          <Flex>
            {FERTILIZER_ELEMENT_NAMES.map((name) => {
              const v = normalizedFertilizer.elements[name];
              if (!v) {
                return null;
              }
              return <Element name={name} key={name} value={v} isOxide />;
            })}
          </Flex>
        </Box>
        <Flex>
          <Flex alignItems="center" justifyContent="center" margin={1}>
            {weight ? (
              <Text textAlign="center" minWidth="3em">
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
          </Flex>
          <IconButton padding={1} alignSelf="center" name="close" onClick={() => onRemove()} />
        </Flex>
      </Flex>
    </Card>
  );
};
