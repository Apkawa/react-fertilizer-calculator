import { Icon } from "@fertilizer/icons";
import React, { type KeyboardEvent, type ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Helmet } from "react-helmet";
import { cx } from "./cx";
import {
  headingClass,
  sidebarCardClass,
  sidebarOverlayClass,
  sidebarOverlayUndockedClass,
} from "./styles.css";
import { useWindowSize } from "./use-window-size";

export interface SidebarActions {
  open: () => void;
  close: () => void;
}

type RenderCb = (props: { modal: SidebarActions }) => ReactNode;

export interface SidebarProps {
  opened?: boolean;
  onClose?: () => void;
  button?: RenderCb;
  title?: string;
  children: ReactNode;
  docked?: boolean;
}

const useSidebarRoot = () => {
  let el = document.querySelector("#sidebar-root");
  if (!el) {
    el = document.createElement("div");
    el.setAttribute("id", "sidebar-root");
    document.body.appendChild(el);
  }
  return el;
};

function SidebarContainer(props: {
  actions: SidebarActions;
  children: ReactNode;
  docked?: boolean;
}) {
  const { children, actions, docked } = props;
  const modalRoot = useSidebarRoot();

  const onClickOverlay = () => {
    if (!docked) {
      actions.close();
    }
  };
  // Esc / Enter / Space закрывают сайдбар (паритет с кликом по оверлею).
  const onKeyDownOverlay = (e: KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClickOverlay();
    }
  };

  return ReactDOM.createPortal(
    <>
      <Helmet>
        <style type="text/css">
          {!docked &&
            `
          body {
            overflow: hidden;
          }
        `}
        </style>
      </Helmet>
      {/* Оверлей закрывает сайдбар по клику вне карточки — это «удобство», не контрол.
          <button> внутрь положить нельзя (карточка содержит собственные интерактивные элементы). */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: оверлей — поверхность «закрыть по клику», не интерактивный контрол */}
      <div
        tabIndex={-1}
        className={cx(sidebarOverlayClass, !docked && sidebarOverlayUndockedClass)}
        style={!docked ? { top: `${window.pageYOffset}px` } : undefined}
        onClick={onClickOverlay}
        onKeyDown={onKeyDownOverlay}
      >
        <div className={sidebarCardClass}>{children}</div>
      </div>
    </>,
    modalRoot,
  );
}

export function Sidebar(props: SidebarProps) {
  const { opened = Boolean(props.docked), button } = props;

  const [closed, setClose] = useState(!opened);
  const windowSize = useWindowSize();

  const [docked, setDocked] = useState(props.docked || windowSize.width > 1024);

  useEffect(() => {
    const d = props.docked || windowSize.width > 1650;
    setDocked(d);
    if (d && closed) {
      setClose(false);
    }
  }, [windowSize, closed, props.docked]);

  useEffect(() => {
    setClose(!opened);
  }, [opened]);

  useEffect(() => {
    if (closed && props.onClose) {
      props.onClose();
    }
  }, [closed, props]);

  const actions: SidebarActions = {
    open: () => setClose(false),
    close: () => setClose(true),
  };
  const renderCbProps = { modal: actions };

  return (
    <>
      {button ? (
        button(renderCbProps)
      ) : (
        // Триггер открытия (бургер) — настоящая кнопка с именем (a11y stage 2)
        <button
          type="button"
          className="cursor-pointer bg-transparent p-0 border-0"
          aria-label="Меню"
          onClick={actions.open}
        >
          <Icon size={42} name="menu" />
        </button>
      )}
      {closed ? null : (
        <SidebarContainer actions={actions} docked={docked}>
          <div className="flex justify-between">
            {docked ? null : (
              // Контрол закрытия — настоящая кнопка с именем (a11y stage 2)
              <button
                type="button"
                className="cursor-pointer bg-transparent p-0 border-0"
                aria-label="Закрыть"
                onClick={actions.close}
              >
                <Icon size={42} name="close" />
              </button>
            )}
            <h2 className={headingClass}>{props.title}</h2>
          </div>
          <div>{props.children}</div>
        </SidebarContainer>
      )}
    </>
  );
}
