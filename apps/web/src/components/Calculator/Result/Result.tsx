import { MACRO_ELEMENT_NAMES, MICRO_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { buildFertilizerFromSolution } from "@fertilizer/calculator/fertilizer";
import { getEmptyElements, getNPKDetailInfo } from "@fertilizer/calculator/helpers";
import { IconButton } from "@fertilizer/icons";
import { Button, Card, Chip, Heading, Modal, type ModalActions, Text } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
import {
  AddEdit as FertilizerAddEditForm,
  formToFertilizer,
  getInitialValues,
} from "@/components/Calculator/FertilizerManager/AddEdit";
import { MixerModal } from "@/components/Calculator/Mixer/Mixer";
import { ResultDilution } from "@/components/Calculator/Result/ResultDilution";
import { useStore } from "@/store";
import { round, sum } from "@/utils";
import { Element } from "../Element";
import { useFertilizerSolutionGroup } from "./hooks";
import { ResultFertilizerList } from "./ResultFertilizerList";

type ResultProps = {};

export const Result: FunctionComponent<ResultProps> = () => {
  // Слайс калькулятора (те же поля, что у redux state.calculator)
  const { fertilizers, result } = useStore((s) => s.calculator);

  // Объем раствора из формы расчёта (null-safe: форма может быть пустая)
  const solution_volume = useStore((s) => s.calculator.calculationForm?.solution_volume);

  const fertilizerWeightGroups = useFertilizerSolutionGroup();

  const elements = result?.elements || getEmptyElements();
  const deltaElements = result?.deltaElements || getEmptyElements();
  const NPKBalance = getNPKDetailInfo(elements);

  const totalWeight = round(sum((result?.fertilizers || []).map((f) => f.weight || 0)), 2);

  // Форма редактора удобрения (zustand: слайс fertilizerEdit)
  const formValues = useStore((s) => s.fertilizerEdit);
  const onSave = (modal: ModalActions) => {
    useStore.getState().pushFertilizer(formToFertilizer(formValues));
    modal.close();
  };
  const complexFertilizer = buildFertilizerFromSolution("", {
    fertilizers,
    fertilizer_weights: result?.fertilizers || [],
    volume: solution_volume,
  });

  return (
    <Card>
      <div className="flex w-full flex-col">
        {/* Заголовок карточки — канон §5: Heading h2 card-title (1.125rem/600).
         * Легасный override text-base убран. */}
        <Heading>Результат расчета</Heading>
        {/* Подпись — второстепенный текст (§5), объём из данных формы */}
        <Text className="mt-1 text-sm text-[var(--muted)]">Для {solution_volume} л раствора</Text>

        {/* Макро-ряд — канон §3.3 / макет: СЕТКА 1 ряд × 8 колонок на ЛЮБОМ
         * экране (grid-cols-8 без responsive-вариантов; компакт ≤799px делает
         * CSS ElementCell). Значения и дельта — из данных расчёта; тон .el-*
         * декоративный (реестр 6B — shared Element ../Element, без дублей). */}
        <div className="mt-3 grid grid-cols-8 gap-1">
          {MACRO_ELEMENT_NAMES.map((k) => (
            <Element key={k} name={k} value={round(elements[k])} delta={round(deltaElements[k])} />
          ))}
        </div>
        {/* Микро-ряд — тот же канон 1×8; значения мг/л (×1000), тон el-micro */}
        <div className="mt-2 grid grid-cols-8 gap-1">
          {MICRO_ELEMENT_NAMES.map((k) => (
            <Element
              key={k}
              name={k}
              value={round(elements[k] * 1000)}
              delta={round(deltaElements[k] * 1000)}
            />
          ))}
        </div>

        {/* Ряд баланса — канон §3.2 / макет: Chip plain в flex-nowrap —
         * всегда одна строка (перенос компактится CSS чипа ≤799px). Значения
         * — из данных расчёта (getNPKDetailInfo по result.elements), а не из
         * литералов макета; K:Mg добавлен из данных (в макете его нет).
         * Подпись «ΔΣ I» с пробелом — маркер App.test. Легасный
         * StyledBalanceCell (кастомный фон/рамка) заменён на Chip. */}
        <div className="mt-3 flex flex-nowrap items-center gap-2">
          <Chip label="ΔΣ I" value={NPKBalance.ion_balance} title="Ионный баланс" />
          <Chip label="EC" value={NPKBalance.EC} />
          <Chip label="%NH4" value={round((NPKBalance.ratio?.NH4?.NO3 || 0) * 100, 1)} />
          <Chip label="K:N" value={NPKBalance.ratio.K.N} />
          <Chip label="K:Ca" value={NPKBalance.ratio.K.Ca} />
          <Chip label="K:Mg" value={NPKBalance.ratio.K.Mg} />
        </div>

        {/* Список расчёта — канон §5/макет: подписи групп semibold, строки
         * text-sm, итоги без кастомных фонов и без custom-width (w-3/4 убран). */}
        <div className="mt-4 flex flex-col gap-2">
          {fertilizerWeightGroups.map(([g, f_weights]) => (
            <div key={g}>
              <Text className="text-sm font-semibold">Раствор {g}</Text>
              {f_weights.length > 0 ? (
                <div className="mt-1 flex flex-col gap-1">
                  <ResultFertilizerList fertilizers={f_weights} />
                </div>
              ) : (
                <Text className="text-sm text-[var(--muted)]">нет макро-удобрений</Text>
              )}
            </div>
          ))}
          <Text className="text-sm">Всего солей: {totalWeight} г.</Text>
          <Text className="text-sm">
            Концентрация солей: {round(totalWeight / (solution_volume ?? 1), 2)} г/л
          </Text>
        </div>

        <ResultDilution />
        {result?.stats && (
          <Text className="mt-2 text-sm text-[var(--muted)]">
            Обработано вариантов: {result?.stats.count} Время: {result?.stats.time} сек
          </Text>
        )}
        {/* Кнопки — канон §3.1 (.btn: tint от --primary, иконка+текст).
         * Легасный backgroundColor="primary" (заливка через alias-класс)
         * убран; onClick модалки сохранён. */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {result?.fertilizers ? (
            <Modal
              button={({ modal }) => (
                <IconButton name="save" onClick={modal.open}>
                  Сохранить комплекс
                </IconButton>
              )}
              container={({ modal }) => (
                <>
                  <FertilizerAddEditForm initialValues={getInitialValues(complexFertilizer)} />
                  <div className="flex justify-end">
                    <Button type="button" onClick={() => onSave(modal)}>
                      Save
                    </Button>
                  </div>
                </>
              )}
            />
          ) : null}
          <MixerModal />
        </div>
      </div>
    </Card>
  );
};
