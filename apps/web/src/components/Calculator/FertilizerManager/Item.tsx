import { normalizeFertilizer } from "@fertilizer/calculator/fertilizer";
import { IconButton } from "@fertilizer/icons";
import { Button, Card, Checkbox, cx, Label, Modal, type ModalActions, Text } from "@fertilizer/ui";
import React, { type ChangeEvent } from "react";
import type { FertilizerInfo } from "@/components/Calculator/types";
import { useStore } from "@/store";
import "@/components/Calculator/fertilizerRow.css";
import { FertilizerComposition } from "../FertilizerComposition";
import { weightForId } from "../fertilizerRow";
import { AddEdit, formToFertilizer } from "./AddEdit";

interface ItemProps {
  fertilizer: FertilizerInfo;
}

export function Item(props: ItemProps) {
  const { fertilizer } = props;
  const normalizedFertilizer = normalizeFertilizer(fertilizer, false);
  // Форма удобрения — глобальный стор (аналог useFormValues)
  const formValues = useStore((s) => s.fertilizerEdit);
  // Отметка ряда (§3.1): тот же id в fertilizers формы расчета — ряд выбран.
  const checked = useStore((s) =>
    Boolean(s.calculator.calculationForm?.fertilizers.some((x) => x.id === fertilizer.id)),
  );
  const result = useStore((s) => s.calculator.result);

  const onToggle = (event: ChangeEvent<HTMLInputElement>) => {
    useStore.getState().toggleFertilizer(fertilizer, event.currentTarget.checked);
  };
  const onRemove = () => {
    useStore.getState().removeFertilizer(fertilizer);
  };
  const onSave = (modal: ModalActions) => {
    useStore.getState().pushFertilizer(formToFertilizer(formValues));
    modal.close();
  };

  // Масса — из result.fertilizers по id (§3.1), только для отмеченного ряда
  // при наличии результата; «N г» — пробел перед «г» (канон .fert-weight).
  const weight = checked && result ? weightForId(result, fertilizer.id)?.weight : undefined;

  return (
    <Card className={cx("fert-row w-auto", !checked && "is-inactive")}>
      {/* Канон ряда (§3.1/§3.5, макет index.html:472–510): шапка ряда — одна
       * строка 2.5rem (grip → чекбокс «Выбрать "<id>"» → имя → масса →
       * edit → delete; delete — правый край ряда, hover danger .fert-del,
       * edit слева от delete), чипы состава — второй ряд под шапкой на всю
       * ширину. Разметка держит DOM-порядок id → chips → edit → delete
       * (пин тестом), визуальный порядок канона задаёт CSS-grid в
       * fertilizerRow.css (.fert-row). Снятый ряд — .is-inactive
       * (приглушение, muted имя, нейтральные чипы — fertilizerRow.css). */}
      {/* Рукоятка ряда: DnD handle ReactSortable (ROW_HANDLE_SELECTOR).
       * Грип — НЕ канонический квадрат (§3.5, 1.5rem×2.5rem): инлайн width
       * перебивает icon-only дефолт IconButton; svg 18px держит CSS-правило
       * .fert-grip (презентационные атрибуты слабее CSS). */}
      <IconButton
        className="fert-grip"
        style={{ width: "1.5rem" }}
        name="grip"
        aria-label="Переместить"
      />
      {/* Имя без кавычек: тестовый regex якорит $ на «)» id-имени.
       * Чекбокс — база ui Checkbox 1rem (как «Игнорировать»), touch-цель
       * ≥40px — label-обёртка .fert-check (fertilizerRow.css). */}
      <Label className="fert-check">
        <Checkbox aria-label={`Выбрать ${fertilizer.id}`} checked={checked} onChange={onToggle} />
      </Label>
      {/* Жирность имени (600, макетный text-sm font-semibold) — из CSS-правила
       * .fert-name в @layer components (fertilizerRow.css), НЕ из утилиты:
       * utility font-semibold (utilities-слой) перебивала бы weight 500
       * снятого ряда .is-inactive (каскад: utilities > components). */}
      <Text className="fert-name min-w-0 text-sm">
        {fertilizer.id} &nbsp;
        {fertilizer.solution_concentration && `[жидкий ${fertilizer.solution_concentration} г/л]`}{" "}
        &nbsp;
        <span title={"Номер помпы в миксере"}>
          {fertilizer.pump_number && `p${fertilizer.pump_number}`}
        </span>{" "}
        &nbsp;
      </Text>
      {/* Состав (§3.2): чипы в DOM до кнопок (пин тестом); визуально — ряд
       * под шапкой, на всю ширину карточки (макет: второй flex flex-wrap
       * gap-1), позицию задаёт .fert-chips в fertilizerRow.css. */}
      <FertilizerComposition elements={normalizedFertilizer.elements} />
      {weight !== undefined ? (
        <Text className="fert-weight text-sm font-semibold">{weight} г</Text>
      ) : null}
      <Modal
        button={({ modal }) => (
          <IconButton
            className="fert-icon"
            name="edit"
            aria-label="Редактировать"
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
        className="fert-icon fert-del"
        name="trash"
        aria-label="Удалить удобрение"
        onClick={onRemove}
      />
    </Card>
  );
}
