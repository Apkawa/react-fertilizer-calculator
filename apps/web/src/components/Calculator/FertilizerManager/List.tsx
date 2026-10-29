import { IconButton } from "@fertilizer/icons";
import { Button, Card, cx, Heading, Modal, type ModalActions, Text } from "@fertilizer/ui";
import React, { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { AddEdit, formToFertilizer } from "@/components/Calculator/FertilizerManager/AddEdit";
import type { FertilizerInfo } from "@/components/Calculator/types";
import { useStore } from "@/store";
// Side-effect импорт: правила шапки/ряда канона (.fert-header, .fert-row и т.д.)
// должны грузиться даже при пустой библиотеке (ни одного Item).
import "@/components/Calculator/fertilizerRow.css";
import { ROW_HANDLE_SELECTOR } from "../fertilizerRow";
import { Item } from "./Item";

type ListProps = {};

// Merged-карточка «Удобрения» (канон §3.1): менеджер над библиотекой
// (calculator.fertilizers) вместо дропдаун-селектора «Добавить удобрение».
// Шапка: заголовок → plus → toggle «показывать все/отмеченные»; импорт/
// экспорт/сброс библиотеки переехали в карточку «Импорт/Экспорт» (§ т.
// заказчика) — под строку «Рецепты».
export function List(props: ListProps) {
  // Список удобрений + форма редактора — глобальный zustand-стор
  const fertilizers = useStore((s) => s.calculator.fertilizers);
  const formValues = useStore((s) => s.fertilizerEdit);
  // Подсказка расчёта «не выбрано удобрений»
  const fertilizersError = useStore((s) => s.fertilizersError);

  // Toggle шапки (т. заказчика): открыт — показаны все ряды библиотеки,
  // закрыт — только отмеченные (чекбокс формы расчёта). Скрытые ряды
  // остаются в DOM и в сторе — индексы react-sortablejs не расходятся.
  const [showAll, setShowAll] = useState(true);

  // react-sortablejs на mount размазывает каждый item флагами chosen/selected
  // и вызывает setList — флаги НЕ данные приложения, срезаем перед записью
  // в стор (стор хранит чистый список FertilizerInfo).
  function onSetList(newList: FertilizerInfo[]) {
    const pure = newList.map((item) => {
      const { chosen, selected, ...f } = item as FertilizerInfo & {
        chosen?: boolean;
        selected?: boolean;
      };
      return f;
    });
    useStore.getState().setFertilizers(pure);
  }

  function onAdd(modal: ModalActions) {
    // plus — добавление в библиотеку (не автов выбор формы расчета)
    useStore.getState().pushFertilizer(formToFertilizer(formValues));
    modal.close();
  }

  return (
    <Card className="flex flex-col gap-3">
      {/* Шапка канона (§3.1 + т. заказчика): заголовок слева, справа — ПЛЮС
       * сразу за заголовком, затем toggle eye (открыт = все ряды, закрыт =
       * только отмеченные). Класс fert-header — CSS-хук (fertilizerRow.css):
       * кнопки шапки — канонические иконко-кнопки 2.5rem × 2.5rem. */}
      <div className="fert-header flex items-center gap-2">
        <Heading className="min-w-0 flex-1">Удобрения</Heading>
        <Modal
          button={({ modal }) => (
            <IconButton
              className="fert-icon shrink-0"
              name="plus"
              aria-label="Добавить удобрение"
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
        <IconButton
          className="fert-icon shrink-0"
          name={showAll ? "eye" : "eye-off"}
          aria-label={showAll ? "Скрыть неактивные удобрения" : "Показать все удобрения"}
          onClick={() => setShowAll(!showAll)}
        />
      </div>
      {/* Подсказка: расчёт без выбранного удобрения (fertilizersError стора). */}
      {fertilizersError ? <Text className="text-[var(--danger)]">{fertilizersError}</Text> : null}
      {/* Список в порядке данных приложения; перестановка — grip-рукояткой
       * ряда (§3.5, handle по aria-имени «Переместить»), запись нового
       * порядка — в стор (обработчики list/setList сохранены точно). */}
      <ReactSortable
        className={cx("flex flex-col gap-2", !showAll && "hide-inactive")}
        list={fertilizers}
        setList={onSetList}
        handle={ROW_HANDLE_SELECTOR}
      >
        {fertilizers.map((f) => (
          <Item fertilizer={f} key={f.id} />
        ))}
      </ReactSortable>
    </Card>
  );
}
