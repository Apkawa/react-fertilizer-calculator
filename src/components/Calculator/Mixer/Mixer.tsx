import {Modal, ModalActions} from "@/components/ui/Modal/Modal";
import {IconButton} from "@/components/ui/IconButton";
import {Save} from "@styled-icons/fa-regular/Save";
import {MixerFormType, MixerOptionsForm} from "@/components/Calculator/Mixer/MixerForm";
import {Button, Flex} from "rebass";
import React, {ComponentType} from "react";
import {useSelector} from "react-redux";
import {getFormValues} from "redux-form";
import {REDUX_FORM_NAME} from "@/components/Calculator/constants";
import {CalculatorFormValues, CalculatorState} from "@/components/Calculator/types";
import {useFormValues} from "@/hooks/ReduxForm";

export const MixerModal: ComponentType = () => {
  const {
    fertilizers,
    mixerOptions
  } = useSelector(getFormValues(REDUX_FORM_NAME)) as CalculatorFormValues
  const {
    result,
  } = useSelector<any>(state => state.calculator) as CalculatorState


  const initialMixerOptions = {
    ...mixerOptions,
    fertilizers
  }
  const [formValues] = useFormValues<MixerFormType>('mixerOptions')

  function onSave(modal: ModalActions) {
    const weights = Object.fromEntries((result?.fertilizers || []).map(f => [f.id, f]))
    let params = formValues.fertilizers
      .filter(f => f.pump_number && weights?.[f.id]?.liquid_weight)
      .map(f => `p${f.pump_number}=${weights?.[f.id]?.liquid_weight}`)
      .join('&')

    window.open(`http://${formValues.url}?${params}`, '_blank')
    modal.close()

  }

  return (
    <Modal
    button={({modal}) => (
      <IconButton
        padding={1}
        alignSelf="center"
        component={Save}
        backgroundColor={'primary'}
        onClick={modal.open}
      >Отправить на миксер</IconButton>
    )}
    container={({modal}) => (
      <>
        <MixerOptionsForm
          initialValues={initialMixerOptions}
        />
        <Flex justifyContent="flex-end">
          <Button type="button" onClick={() => onSave(modal)}>Приготовить</Button>
        </Flex>
      </>
    )}
  />
  )
}
