import { IconButton } from "@fertilizer/icons";
import { Button, Modal, type ModalActions } from "@fertilizer/ui";
import React, { type ComponentType } from "react";
import { type MixerFormType, MixerOptionsForm } from "@/components/Calculator/Mixer/MixerForm";
import { useStore } from "@/store";

export const MixerModal: ComponentType = () => {
  // Форма расчёта (null-safe): выбранные удобрения + параметры миксера
  const form = useStore((s) => s.calculator.calculationForm);
  const result = useStore((s) => s.calculator.result);

  const initialMixerOptions: MixerFormType = {
    ...form?.mixerOptions,
    fertilizers: form?.fertilizers ?? [],
  };
  // Форма миксера (zustand: слайс mixerOptions)
  const formValues = useStore((s) => s.mixerOptions);

  function onSave(modal: ModalActions) {
    const weights = Object.fromEntries((result?.fertilizers || []).map((f) => [f.id, f]));
    const params = formValues.fertilizers
      .filter((f) => f.pump_number && weights?.[f.id]?.liquid_weight)
      .map((f) => `p${f.pump_number}=${weights?.[f.id]?.liquid_weight}`)
      .join("&");

    window.open(`http://${formValues.url}?${params}`, "_blank");
    modal.close();
  }

  return (
    <Modal
      button={({ modal }) => (
        <IconButton
          padding={1}
          alignSelf="center"
          name="save"
          backgroundColor={"primary"}
          onClick={modal.open}
        >
          Отправить на миксер
        </IconButton>
      )}
      container={({ modal }) => (
        <>
          <MixerOptionsForm initialValues={initialMixerOptions} />
          <div className="flex justify-end">
            <Button type="button" onClick={() => onSave(modal)}>
              Приготовить
            </Button>
          </div>
        </>
      )}
    />
  );
};
