import React, { type FunctionComponent, useEffect } from "react";
import type { FertilizerInfo, MixerOptions } from "@/components/Calculator/types";
import { Input } from "@/components/ui/Form";
import { useStore } from "@/store";
import { FormProvider } from "@/store/form-context";

export interface MixerFormType extends MixerOptions {
  fertilizers: FertilizerInfo[];
}

interface MixerFormProps {
  initialValues?: MixerFormType;
}

// Форма миксера (zustand): сама предоставляет FormProvider (mixerOptions) —
// поле `url` читает/пишет глобальный стор. Инициализация при монтировании
// заменяет initialValues + enableReinitialize redux-form. Запись верхнего уровня
// через setMixerField — форма миксера плоская.
export const MixerOptionsForm: FunctionComponent<MixerFormProps> = (props) => {
  const { initialValues } = props;

  // Переинициализация формы (аналог initialValues + enableReinitialize redux-form):
  // `url` и `fertilizers` приходят из исходной формы расчёта (Mixer.tsx).
  useEffect(() => {
    const { setMixerField } = useStore.getState();
    const form = initialValues ?? ({} as MixerFormType);
    setMixerField("url", form.url);
    setMixerField("fertilizers", form.fertilizers);
  }, [initialValues]);

  return (
    <FormProvider formName="mixerOptions">
      <form>
        <div className="flex flex-col">
          <Input name="url" title="URL" label="URL" />
        </div>
      </form>
    </FormProvider>
  );
};
