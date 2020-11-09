import React, {ReactNode} from "react";
import ReactDOM from 'react-dom'
import {Card, Flex} from "rebass";
import styled from '@emotion/styled'
import {Helmet} from "react-helmet";


interface ModalContainerProps {
  children: ReactNode,
}

const useModalRoot = () => {
  let el = document.querySelector('#modal-root')
  if (!el) {
    el = document.createElement('div')
    el.setAttribute('id', 'modal-root')
    document.body.appendChild(el)
  }
  return el
}

const StyledOverlay = styled(Flex)`
  overflow-y: auto;
  position: absolute;
  width: 100%;
  height: 100%;
  top: ${() => `${window.pageYOffset}px`};
  left: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 999;
  
  // Mobile
  @media screen and (max-height: 500px), screen and (max-width: 500px) {
    align-items: initial;
  }
`

export function ModalContainer(props: ModalContainerProps) {
  const {
    children,
  } = props
  const modalRoot = useModalRoot()
  return ReactDOM.createPortal(
    <>
      <Helmet>
        <style type='text/css'>
          {`
          body {
            overflow: hidden;
          }
        `}
        </style>
      </Helmet>
      <StyledOverlay>
        <Card backgroundColor='#fff' height="max-content">
          {children}
        </Card>
      </StyledOverlay>
    </>
    , modalRoot)
}
