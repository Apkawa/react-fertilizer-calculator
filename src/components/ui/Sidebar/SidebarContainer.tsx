import React, {ReactNode} from "react";
import ReactDOM from 'react-dom'
import {Card, Flex} from "rebass";
import styled from '@emotion/styled'
import {Helmet} from "react-helmet";
import {SidebarActions} from "@/components/ui/Sidebar/Sidebar";


interface SidebarContainerProps {
  actions: SidebarActions,
  children: ReactNode,
  docked?: boolean,
}

const useSidebarRoot = () => {
  let el = document.querySelector('#sidebar-root')
  if (!el) {
    el = document.createElement('div')
    el.setAttribute('id', 'sidebar-root')
    document.body.appendChild(el)
  }
  return el
}

interface OverlayProps  {
  docked?: boolean
}

const StyledOverlay = styled(Flex)<OverlayProps>`
  overflow-y: auto;
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  justify-content: left;
  align-items: stretch;
  z-index: 999;
  width: fit-content;
  
  //// Mobile
  //@media screen and (max-height: 500px), screen and (max-width: 500px) {
  //  align-items: initial;
  //}
  ${({docked}) => (docked? `` : `
    top: ${() => `${window.pageYOffset}px`};
    width: 100%;
    background-color: rgba(255, 255, 255, 0.5);
  `)}
`

export function SidebarContainer(props: SidebarContainerProps) {
  const {
    children,
    actions,
    docked
  } = props
  const modalRoot = useSidebarRoot()

  const onClickOverlay = () => {
    if (!docked) {
      actions.close()
    }
  }
  return ReactDOM.createPortal(
    <>
      <Helmet>
        <style type='text/css'>
          {!docked && `
          body {
            overflow: hidden;
          }
        `}
        </style>
      </Helmet>
      <StyledOverlay
        docked={docked}
        onClick={onClickOverlay}
      >
        <Card backgroundColor='#fff' height="100vh" width="300px" marginRight={2}>
          {children}
        </Card>
      </StyledOverlay>
    </>
    , modalRoot)
}
