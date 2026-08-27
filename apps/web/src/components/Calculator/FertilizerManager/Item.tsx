import { FERTILIZER_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { normalizeFertilizer } from "@fertilizer/calculator/fertilizer";
import { IconButton } from "@fertilizer/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { Box, Button, Card, Flex, Text } from "rebass";
import { fertilizerPush, fertilizerRemove } from "@/components/Calculator/actions";
import { FERTILIZER_EDIT_FORM_NAME } from "@/components/Calculator/FertilizerManager/constants";
import type { AddEditFormType } from "@/components/Calculator/FertilizerManager/types";
import type { FertilizerInfo } from "@/components/Calculator/types";
import { Modal, type ModalActions } from "@/components/ui/Modal/Modal";
import { useFormValues } from "@/hooks/ReduxForm";
import { Element } from "../FertilizerSelect/SelectedListItem";
import { AddEdit, formToFertilizer, getInitialValues } from "./AddEdit";

interface ItemProps {
  fertilizer: FertilizerInfo;
}

export function Item(props: ItemProps) {
  const { fertilizer } = props;
  const normalizedFertilizer = normalizeFertilizer(fertilizer, false);
  const [formValues] = useFormValues<AddEditFormType>(FERTILIZER_EDIT_FORM_NAME);
  const dispatch = useDispatch();
  const onRemove = () => {
    dispatch(fertilizerRemove(fertilizer));
  };
  const onSave = (modal: ModalActions) => {
    dispatch(fertilizerPush(formToFertilizer(formValues)));
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
                  <AddEdit initialValues={getInitialValues(fertilizer)} />
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
