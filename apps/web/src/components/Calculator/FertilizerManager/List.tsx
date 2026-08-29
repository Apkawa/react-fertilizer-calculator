import { IconButton } from "@fertilizer/icons";
import { Button, Card, Heading, Modal, type ModalActions } from "@fertilizer/ui";
import React from "react";
import { ReactSortable } from "react-sortablejs";
import { AddEdit, formToFertilizer } from "@/components/Calculator/FertilizerManager/AddEdit";
import { ExportFertilizers } from "@/components/Calculator/ImportExport/ExportFertilizers";
import { ImportFertilizers } from "@/components/Calculator/ImportExport/ImportFertilizers";
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
    <div className="flex flex-col">
      <div className="flex">
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
              <div className="flex justify-end">
                <Button type="button" onClick={() => onAdd(modal)}>
                  Save
                </Button>
              </div>
            </>
          )}
        />
      </div>
      <ReactSortable
        list={fertilizers}
        setList={(newList) => useStore.getState().setFertilizers(newList)}
      >
        {fertilizers.map((f) => (
          <Item fertilizer={f} key={f.id} />
        ))}
      </ReactSortable>
      <Card>
        <Heading className="text-base">Импорт/Экспорт</Heading>
        <div className="flex flex-col p-4">
          <div className="flex items-center pb-2 justify-between flex-wrap">
            {/* Левый отступ у всех дочерних элементов (marginLeft у children) */}
            <div className="[&>*]:ml-2">
              <ImportFertilizers />
              <ExportFertilizers />
              <IconButton name="restart" onClick={() => useStore.getState().resetFertilizers()} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
