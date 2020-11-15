import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {CalculatorState} from "@/components/Calculator/types";
import {Box, Button, Card, Flex, Heading} from "rebass";
import {ReactSortable} from "react-sortablejs";

import {Item} from "./Item";
import {fertilizerPush, fertilizerReset, fertilizerSet} from "@/components/Calculator/actions";
import {Modal, ModalActions} from "@/components/ui/Modal/Modal";
import {IconButton} from "@/components/ui/IconButton";
import {Plus} from "@styled-icons/boxicons-regular/Plus";
import {AddEdit, formToFertilizer, getInitialValues} from "@/components/Calculator/FertilizerManager/AddEdit";
import {useFormValues} from "@/hooks/ReduxForm";
import {AddEditFormType} from "@/components/Calculator/FertilizerManager/types";
import {FERTILIZER_EDIT_FORM_NAME} from "@/components/Calculator/FertilizerManager/constants";
import {ImportFertilizers} from "@/components/Calculator/ImportExport/ImportFertilizers";
import {ExportFertilizers} from "@/components/Calculator/ImportExport/ExportFertilizers";
import {Restart} from "@styled-icons/remix-line/Restart";

interface ListProps {
}

export function List(props: ListProps) {
  const {
    fertilizers,
  } = useSelector<any>(state => state.calculator) as CalculatorState
  const [formValues] = useFormValues<AddEditFormType>(FERTILIZER_EDIT_FORM_NAME)
  const dispatch = useDispatch()

  function onAdd(modal: ModalActions) {
    dispatch(fertilizerPush(formToFertilizer(formValues)))
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
      <Card>
        <Heading fontSize={2}>Импорт/Экспорт</Heading>
        <Flex flexDirection="column" p={3}>
          <Flex alignItems='center'
                paddingBottom={2}
                justifyContent="space-between"
                flexWrap="wrap"
          >
            <Box sx={{
              "&>*": {
                marginLeft: 1
              }
            }}>
              <ImportFertilizers/>
              <ExportFertilizers/>
              <IconButton
                component={Restart}
                onClick={() => dispatch(fertilizerReset())}
              />
            </Box>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  )
}
