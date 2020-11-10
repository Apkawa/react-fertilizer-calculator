import React from "react";
import {FertilizerInfo} from "@/calculator/types";
import {Box, Button, Card, Flex, Text} from "rebass";

import {normalizeFertilizer} from "@/calculator/fertilizer";
import {FERTILIZER_ELEMENT_NAMES} from "@/calculator/constants";

import {IconButton} from "@/components/ui/IconButton";
import {Edit} from "@styled-icons/fa-regular/Edit"
import {Trash} from "@styled-icons/fa-solid/Trash";

import {Element} from "../FertilizerSelect/SelectedListItem";
import {AddEdit, formToFertilizer, getInitialValues} from './AddEdit';
import {Modal, ModalActions} from "@/components/ui/Modal/Modal";
import {useFormValues} from "@/hooks/ReduxForm";
import {FERTILIZER_EDIT_FORM_NAME} from "@/components/Calculator/FertilizerManager/constants";
import {useDispatch} from "react-redux";
import {fertilizerPush, fertilizerRemove} from "@/components/Calculator/actions";
import {AddEditFormType} from "@/components/Calculator/FertilizerManager/types";

interface ItemProps {
  fertilizer: FertilizerInfo
}

export function Item(props: ItemProps) {
  const {fertilizer} = props
  const normalizedFertilizer = normalizeFertilizer(fertilizer, false)
  const [formValues] = useFormValues<AddEditFormType>(FERTILIZER_EDIT_FORM_NAME)
  const dispatch = useDispatch()
  const onRemove = () => {
    dispatch(fertilizerRemove(fertilizer))
  }
  const onSave = (modal: ModalActions) => {
    dispatch(fertilizerPush(formToFertilizer(formValues)))
    modal.close()
  }
  return (
    <>
      <Card width={'auto'} marginBottom={2}>
        <Flex justifyContent={'space-between'} alignItems="center">
          <Box flex={1}>
            <Text flex={1}>
              {fertilizer.id} {fertilizer.solution_concentration && `[жидкий ${fertilizer.solution_concentration} г/л]`}
            </Text>
            <Flex>
              {
                FERTILIZER_ELEMENT_NAMES.map((name) => {
                    let v = normalizedFertilizer.elements[name]
                    if (!v) {
                      return null
                    }
                    return <Element
                      name={name}
                      key={name}
                      value={v}
                    />
                  }
                )
              }
            </Flex>
          </Box>
          <Flex>
            <Modal
              button={({modal}) => (
                <IconButton
                  padding={1}
                  alignSelf="center"
                  component={Edit}
                  backgroundColor={'primary'}
                  onClick={modal.open}
                />
              )}
              container={({modal}) => (
                <>
                <AddEdit
                  initialValues={getInitialValues(fertilizer)}
                />
                  <Flex justifyContent="flex-end">
                    <Button type="button" onClick={() => onSave(modal)}>Save</Button>
                  </Flex>
                </>
              )}
            />
            <IconButton
              padding={1}
              alignSelf="center"
              component={Trash}
              backgroundColor={'danger'}
              onClick={onRemove}
            />
          </Flex>
        </Flex>
      </Card>
    </>
  )
}
