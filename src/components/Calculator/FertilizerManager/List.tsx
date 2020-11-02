import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {CalculatorState} from "@/components/Calculator/types";
import {Button, Flex} from "rebass";
import {ReactSortable} from "react-sortablejs";

import {Item} from "./Item";
import {fertilizerPush, fertilizerSet} from "@/components/Calculator/actions";
import {Modal, ModalActions} from "@/components/ui/Modal/Modal";
import {IconButton} from "@/components/ui/IconButton";
import {Plus} from "@styled-icons/boxicons-regular/Plus";
import {AddEdit, getInitialValues} from "@/components/Calculator/FertilizerManager/AddEdit";
import {useFormValues} from "@/hooks/ReduxForm";
import {AddEditFormType} from "@/components/Calculator/FertilizerManager/types";
import {FERTILIZER_EDIT_FORM_NAME} from "@/components/Calculator/FertilizerManager/constants";
import {FertilizerInfo} from "@/calculator/types";

interface ListProps {
}

export function List(props: ListProps) {
  const {
    fertilizers,
  } = useSelector<any>(state => state.calculator) as CalculatorState
  const [formValues] = useFormValues<AddEditFormType>(FERTILIZER_EDIT_FORM_NAME)
  const dispatch = useDispatch()

  function onAdd(modal: ModalActions) {
    const f: FertilizerInfo = {
      id: formValues.id,
      name: formValues.id,
    }
    if (formValues.composition_enable) {
      f.composition = formValues.composition
    } else {
      f.npk = formValues.npk
    }
    if (formValues.solution_density_enable) {
      f.solution_density = formValues.solution_density
    }
    dispatch(fertilizerPush(f))
    modal.close()

  }

  return (
    <Flex flexDirection='column'>
      <Flex>
        <Modal
          button={({modal}) => (
            <IconButton
              padding={1}
              alignSelf="center"
              component={Plus}
              backgroundColor={'primary'}
              onClick={modal.open}
            />
          )}
          container={({modal}) => (
            <>
              <AddEdit
                initialValues={getInitialValues({id: ''})}
              />
              <Flex justifyContent="flex-end">
                <Button type="button" onClick={() => onAdd(modal)}>Save</Button>
              </Flex>
            </>
          )}
        />
      </Flex>
      <ReactSortable list={fertilizers} setList={newList => dispatch(fertilizerSet(newList))}>
        {fertilizers.map(f => (
          <Item fertilizer={f} key={f.id}/>
        ))}
      </ReactSortable>
    </Flex>
  )
}
