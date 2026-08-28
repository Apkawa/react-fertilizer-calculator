import { FERTILIZER_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { normalizeFertilizer } from "@fertilizer/calculator/fertilizer";
import { IconButton } from "@fertilizer/icons";
import React from "react";
import { Box, Button, Card, Flex, Text } from "rebass";
import type { FertilizerInfo } from "@/components/Calculator/types";
import { Modal, type ModalActions } from "@/components/ui/Modal/Modal";
import { useStore } from "@/store";
import { Element } from "../FertilizerSelect/SelectedListItem";
import { AddEdit, formToFertilizer } from "./AddEdit";

interface ItemProps {
  fertilizer: FertilizerInfo;
}

export function Item(props: ItemProps) {
  const { fertilizer } = props;
  const normalizedFertilizer = normalizeFertilizer(fertilizer, false);
  // Форма удобрения — глобальный стор (аналог useFormValues)
  const formValues = useStore((s) => s.fertilizerEdit);

  const onRemove = () => {
    useStore.getState().removeFertilizer(fertilizer);
  };
  const onSave = (modal: ModalActions) => {
    useStore.getState().pushFertilizer(formToFertilizer(formValues));
    modal.close();
  };
  return (
    <>
      <Card width={"auto"} marginBottom={2}>
        <Flex justifyContent={"space-between"} alignItems="center">
          <Box flex={1}>
            <Text flex={1}>
              {fertilizer.id} &nbsp;
              {fertilizer.solution_concentration &&
                `[жидкий ${fertilizer.solution_concentration} г/л]`}{" "}
              &nbsp;
              <span title={"Номер помпы в миксере"}>
                {fertilizer.pump_number && `p${fertilizer.pump_number}`}
              </span>{" "}
              &nbsp;
            </Text>
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
            <Modal
              button={({ modal }) => (
                <IconButton
                  padding={1}
                  alignSelf="center"
                  name="edit"
                  backgroundColor={"primary"}
                  onClick={modal.open}
                />
              )}
              container={({ modal }) => (
                <>
                  <AddEdit fertilizer={fertilizer} />
                  <Flex justifyContent="flex-end">
                    <Button type="button" onClick={() => onSave(modal)}>
                      Save
                    </Button>
                  </Flex>
                </>
              )}
            />
            <IconButton
              padding={1}
              alignSelf="center"
              name="trash"
              backgroundColor={"danger"}
              onClick={onRemove}
            />
          </Flex>
        </Flex>
      </Card>
    </>
  );
}
