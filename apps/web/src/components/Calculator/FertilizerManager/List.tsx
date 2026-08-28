import { IconButton } from "@fertilizer/icons";
import React from "react";
import { ReactSortable } from "react-sortablejs";
import { Box, Button, Card, Flex, Heading } from "rebass";
import { AddEdit, formToFertilizer } from "@/components/Calculator/FertilizerManager/AddEdit";
import { ExportFertilizers } from "@/components/Calculator/ImportExport/ExportFertilizers";
import { ImportFertilizers } from "@/components/Calculator/ImportExport/ImportFertilizers";
import { Modal, type ModalActions } from "@/components/ui/Modal/Modal";
import { useStore } from "@/store";
import { Item } from "./Item";

type ListProps = {};

export function List(props: ListProps) {
  // Список удобрений + форма редактора — глобальный zustand-стор
  const fertilizers = useStore((s) => s.calculator.fertilizers);
  const formValues = useStore((s) => s.fertilizerEdit);

  function onAdd(modal: ModalActions) {
    useStore.getState().pushFertilizer(formToFertilizer(formValues));
    modal.close();
  }

  return (
    <Flex flexDirection="column">
      <Flex>
        <Modal
          button={({ modal }) => (
            <IconButton
              padding={1}
              alignSelf="center"
              name="plus"
              backgroundColor={"primary"}
              onClick={modal.open}
            />
          )}
          container={({ modal }) => (
            <>
              <AddEdit />
              <Flex justifyContent="flex-end">
                <Button type="button" onClick={() => onAdd(modal)}>
                  Save
                </Button>
              </Flex>
            </>
          )}
        />
      </Flex>
      <ReactSortable
        list={fertilizers}
        setList={(newList) => useStore.getState().setFertilizers(newList)}
      >
        {fertilizers.map((f) => (
          <Item fertilizer={f} key={f.id} />
        ))}
      </ReactSortable>
      <Card>
        <Heading fontSize={2}>Импорт/Экспорт</Heading>
        <Flex flexDirection="column" p={3}>
          <Flex
            alignItems="center"
            paddingBottom={2}
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <Box
              sx={{
                "&>*": {
                  marginLeft: 1,
                },
              }}
            >
              <ImportFertilizers />
              <ExportFertilizers />
              <IconButton name="restart" onClick={() => useStore.getState().resetFertilizers()} />
            </Box>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
