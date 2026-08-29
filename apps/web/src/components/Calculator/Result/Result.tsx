import { MACRO_ELEMENT_NAMES, MICRO_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { buildFertilizerFromSolution } from "@fertilizer/calculator/fertilizer";
import { getEmptyElements, getNPKDetailInfo } from "@fertilizer/calculator/helpers";
import { IconButton } from "@fertilizer/icons";
import { Button, Card, Heading, Modal, type ModalActions, Text } from "@fertilizer/ui";
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
import { Element } from "../FertilizerSelect/SelectedListItem";
import { StyledBalanceCell } from "../Options/Recipe";
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

  // const liquidFertilizersVolume = round(sum((result?.fertilizers || []).map(f => f.volume || 0)), 1)
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
      <div className="flex w-full flex-col items-center">
        <Heading className="text-base">Результат расчета</Heading>
        <div className="flex w-full justify-around">
          {elements &&
            MACRO_ELEMENT_NAMES.map((k) => (
              <Element
                key={k}
                name={k}
                value={round(elements[k])}
                delta={round(deltaElements[k])}
              />
            ))}
        </div>
        <div className="flex w-full justify-around">
          {elements &&
            MICRO_ELEMENT_NAMES.map((k) => (
              <Element
                key={k}
                name={k}
                value={round(elements[k] * 1000)}
                delta={round(deltaElements[k] * 1000)}
              />
            ))}
        </div>
        <div className="flex justify-around">
          <StyledBalanceCell
            name="ΔΣ I"
            value={NPKBalance.ion_balance}
            title={"Ионный баланс, дб == 0±5%"}
          />
          <StyledBalanceCell name="EC" value={NPKBalance.EC} />
          <StyledBalanceCell
            name="%NH4"
            value={round((NPKBalance.ratio?.NH4?.NO3 || 0) * 100, 1)}
          />
          <StyledBalanceCell name="K:N" value={NPKBalance.ratio.K.N} />
          <StyledBalanceCell name="K:Ca" value={NPKBalance.ratio.K.Ca} />
          <StyledBalanceCell name="K:Mg" value={NPKBalance.ratio.K.Mg} />
        </div>
        {/* Список расчёта: полный на узких экранах, 75% от карточки на широких (было styled-ul) */}
        <ul className="min-[800px]:w-3/4">
          <li>Для {solution_volume}л раствора</li>
          {fertilizerWeightGroups.map(([g, f_weights]) => (
            <li key={g}>
              <b>Раствор {g}</b>
              <ul>
                <ResultFertilizerList fertilizers={f_weights} />
              </ul>
            </li>
          ))}
          <li>Всего солей: {totalWeight} г.</li>
          <li>Концентрация солей: {round(totalWeight / (solution_volume ?? 1), 2)} г/л</li>
        </ul>
        <ResultDilution />
        {result?.stats && (
          <Text>
            Обработано вариантов: {result?.stats.count} Время: {result?.stats.time} сек
          </Text>
        )}
        <div className="flex">
          {result?.fertilizers ? (
            <div className="flex">
              <Modal
                button={({ modal }) => (
                  <IconButton
                    padding={1}
                    alignSelf="center"
                    name="save"
                    backgroundColor={"primary"}
                    onClick={modal.open}
                  >
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
            </div>
          ) : null}
          <div className="flex">
            <MixerModal />
          </div>
        </div>
      </div>
    </Card>
  );
};
