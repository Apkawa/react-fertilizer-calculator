import React, {ReactNode, useEffect, useState} from "react";
import {Box, Flex, Heading} from "rebass";
import {Icon} from "@/components/ui/Icon";
import {Menu} from "@styled-icons/boxicons-regular/Menu"
import {Cross} from "@styled-icons/entypo/Cross";
import {SidebarContainer} from "@/components/ui/Sidebar/SidebarContainer";
import {useWindowSize} from "@/hooks/screen";

export interface SidebarActions {
  open: () => void,
  close: () => void,
}

type RenderCb = (props: { modal: SidebarActions }) => ReactNode

interface SidebarProps {
  opened?: boolean,
  onClose?: () => void,
  button?: RenderCb,
  title?: string,
  children: ReactNode,
  docked?: boolean,
}


export function Sidebar(props: SidebarProps) {
  const {
    opened = Boolean(props.docked),
    button,
  } = props

  const [closed, setClose] = useState(!opened)
  const windowSize = useWindowSize()

  const [docked, setDocked] = useState(props.docked || windowSize.width > 1024)


  useEffect(() => {
    const d = props.docked || windowSize.width > 1650
    setDocked(d)
    if (d && closed) {
      setClose(false)
    }
  }, [windowSize, closed, props.docked])

  useEffect(() => {
    setClose(!opened)
  }, [opened])

  useEffect(() => {
    if (closed && props.onClose) {
      props.onClose()
    }
  }, [closed, props])

  const actions: SidebarActions = {
    open: () => setClose(false),
    close: () => setClose(true),
  }
  const renderCbProps = {modal: actions}

  return (
    <>
      {button ? button(renderCbProps) : (
        <Icon
          size={42}
          component={Menu}
          onClick={actions.open}
        />
      )}
      {closed ? null :
        <SidebarContainer actions={actions} docked={docked}>
          <Flex justifyContent='space-between'>
            {docked ? null : <Icon size={42} component={Cross} onClick={actions.close}/>}
            <Heading fontSize={2}>{props.title}</Heading>
          </Flex>
          <Box>
            {props.children}
          </Box>
        </SidebarContainer>
      }
    </>
  )
}

