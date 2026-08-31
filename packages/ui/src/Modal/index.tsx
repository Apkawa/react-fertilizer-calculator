import { Icon } from "@fertilizer/icons";
import React, { type ReactNode, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Helmet } from "react-helmet";
import "./style.css";

export interface ModalActions {
  open: () => void;
  close: () => void;
}

type RenderCb = (props: { modal: ModalActions }) => ReactNode;

// Фокусируемые элементы диалога (первый из них получает фокус при открытии).
const FOCUSABLE_SELECTOR =
  "button, input, select, textarea, [href], [tabindex]:not([tabindex='-1'])";

// Счётчик для уникальных id заголовков: в React 16 нет useId,
// а id нужен для aria-labelledby (стабильный на время жизни инстанса).
let titleIdCounter = 0;

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

function ModalContainer(props: {
  children: ReactNode;
  cardRef: React.RefObject<HTMLDivElement>;
  titleId: string;
}) {
  const { children, cardRef, titleId } = props;
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
      <div className="ui-modal-overlay" style={{ top: `${window.pageYOffset}px` }}>
        {/* a11y (stage 3): диалоговая семантика — role/aria-modal/aria-labelledby;
            tabIndex=-1: фокус при открытии уходит сюда, если внутри нет
            фокусируемых элементов, но сам он в tab-порядке не участвует. */}
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="ui-modal-card"
        >
          {children}
        </div>
      </div>
    </>,
    modalRoot,
  );
}

export function Modal(props: ModalProps) {
  const { opened = false, button, container } = props;

  const [closed, setClose] = useState(!opened);
  // Стабильный уникальный id заголовка (инициализатор useState — один раз на инстанс).
  const [titleId] = useState(() => `modal-title-${++titleIdCounter}`);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  // Элемент, у которого был фокус до открытия модалки (триггер) — вернём ему при закрытии.
  const lastActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setClose(!opened);
  }, [opened]);

  // a11y (stage 3): фокус-менеджмент по минимуму (без полного focus-trap — out of scope):
  // при открытии запоминаем текущий фокус (триггер) и переносим его внутрь диалога
  // (первый фокусируемый элемент, иначе сам диалог); при закрытии — возвращаем.
  useEffect(() => {
    if (closed) {
      const prev = lastActiveRef.current;
      lastActiveRef.current = null;
      if (prev) {
        prev.focus();
      }
      return;
    }
    // document.activeElement типизирован как Element — сузиваем до HTMLElement.
    const active = document.activeElement;
    lastActiveRef.current = active instanceof HTMLElement ? active : null;
    const dialog = dialogRef.current;
    if (dialog) {
      const firstFocusable = dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (firstFocusable ?? dialog).focus();
    }
  }, [closed]);

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
        <ModalContainer cardRef={dialogRef} titleId={titleId}>
          <div className="flex justify-between">
            <h2 id={titleId} className="ui-heading">
              {props.title}
            </h2>
            {/* Контрол закрытия — настоящая кнопка с доступным именем (a11y stage 2) */}
            <button
              type="button"
              className="cursor-pointer bg-transparent p-0 border-0"
              aria-label="Закрыть"
              onClick={modalActions.close}
            >
              <Icon name="close" />
            </button>
          </div>
          <div>{container(renderCbProps)}</div>
        </ModalContainer>
      )}
    </>
  );
}
