import { FERTILIZER_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { normalizeFertilizer } from "@fertilizer/calculator/fertilizer";
import { IconButton } from "@fertilizer/icons";
import { Button, Card, Modal, type ModalActions, Text } from "@fertilizer/ui";
import React from "react";
import type { FertilizerInfo } from "@/components/Calculator/types";
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
      <Card className="w-auto mb-2">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <Text className="flex-1">
              {fertilizer.id} &nbsp;
              {fertilizer.solution_concentration &&
                `[жидкий ${fertilizer.solution_concentration} г/л]`}{" "}
              &nbsp;
              <span title={"Номер помпы в миксере"}>
                {fertilizer.pump_number && `p${fertilizer.pump_number}`}
              </span>{" "}
              &nbsp;
            </Text>
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
            <Modal
              button={({ modal }) => (
                <IconButton
                  padding={1}
                  alignSelf="center"
                  name="edit"
                  backgroundColor={"primary"}
                  aria-label="Изменить"
                  onClick={modal.open}
                />
              )}
              container={({ modal }) => (
                <>
                  <AddEdit fertilizer={fertilizer} />
                  <div className="flex justify-end">
                    <Button type="button" onClick={() => onSave(modal)}>
                      Save
                    </Button>
                  </div>
                </>
              )}
            />
            <IconButton
              padding={1}
              alignSelf="center"
              name="trash"
              backgroundColor={"danger"}
              aria-label="Удалить"
              onClick={onRemove}
            />
          </div>
        </div>
      </Card>
    </>
  );
}
