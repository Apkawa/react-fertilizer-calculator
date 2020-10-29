import React, {ReactNode, useEffect, useState} from "react";
import {ModalContainer} from "@/components/ui/Modal/ModalContainer";
import {Box, Flex} from "rebass";
import {Icon} from "@/components/ui/Icon";
import {Cross} from "@styled-icons/entypo/Cross";

export interface ModalActions {
  open: () => void,
  close: () => void,
}

type RenderCb = (props: {modal: ModalActions}) => ReactNode

interface ModalProps {
  opened?: boolean,
  onClose?: () => void,
  button?: RenderCb,
  container: RenderCb,
}

export function Modal(props: ModalProps) {
  const {
    opened = false,
    button,
    container,
  } = props

  const [closed, setClose] = useState(!opened)

  useEffect(() => {
    setClose(!opened)
  }, [opened])

  useEffect(() => {
    if (closed && props.onClose) {
      props.onClose()
    }
  }, [closed, props])

  const modalActions: ModalActions = {
    open: () => setClose(false),
    close: () => setClose(true),
  }
  const renderCbProps = {modal: modalActions}

  return (
    <>
      {button && button(renderCbProps)}
      {closed ? null : <ModalContainer>
        <Flex justifyContent='flex-end'>
          <Icon component={Cross} onClick={modalActions.close}/>
        </Flex>
        <Box>
          {container(renderCbProps)}
        </Box>
      </ModalContainer>
      }
    </>
  )
}
