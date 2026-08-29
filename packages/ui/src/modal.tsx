import { Icon } from "@fertilizer/icons";
import React, { type ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Helmet } from "react-helmet";
import { headingClass, modalCardClass, modalOverlayClass } from "./styles.css";

export interface ModalActions {
  open: () => void;
  close: () => void;
}

type RenderCb = (props: { modal: ModalActions }) => ReactNode;

export interface ModalProps {
  opened?: boolean;
  onClose?: () => void;
  button?: RenderCb;
  title?: string;
  container: RenderCb;
}

const useModalRoot = () => {
  let el = document.querySelector("#modal-root");
  if (!el) {
    el = document.createElement("div");
    el.setAttribute("id", "modal-root");
    document.body.appendChild(el);
  }
  return el;
};

function ModalContainer(props: { children: ReactNode }) {
  const { children } = props;
  const modalRoot = useModalRoot();
  return ReactDOM.createPortal(
    <>
      <Helmet>
        <style type="text/css">
          {`
          body {
            overflow: hidden;
          }
        `}
        </style>
      </Helmet>
      <div className={modalOverlayClass} style={{ top: `${window.pageYOffset}px` }}>
        <div className={modalCardClass}>{children}</div>
      </div>
    </>,
    modalRoot,
  );
}

export function Modal(props: ModalProps) {
  const { opened = false, button, container } = props;

  const [closed, setClose] = useState(!opened);

  useEffect(() => {
    setClose(!opened);
  }, [opened]);

  useEffect(() => {
    if (closed && props.onClose) {
      props.onClose();
    }
  }, [closed, props]);

  const modalActions: ModalActions = {
    open: () => setClose(false),
    close: () => setClose(true),
  };
  const renderCbProps = { modal: modalActions };

  return (
    <>
      {button && button(renderCbProps)}
      {closed ? null : (
        <ModalContainer>
          <div className="flex justify-between">
            <h2 className={headingClass}>{props.title}</h2>
            <Icon name="close" onClick={modalActions.close} />
          </div>
          <div>{container(renderCbProps)}</div>
        </ModalContainer>
      )}
    </>
  );
}
