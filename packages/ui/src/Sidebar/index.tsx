import { Icon, IconButton } from "@fertilizer/icons";
import React, {
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { Helmet } from "react-helmet";
import { cx } from "../cx";
import textCss from "../Text/style.module.css";
import css from "./style.module.css";

export interface SidebarActions {
  open: () => void;
  close: () => void;
}

type RenderCb = (props: { modal: SidebarActions }) => ReactNode;

export interface SidebarProps {
  /** Открыт ли сайдбар (drawer-режим управляется извне — Root.tsx). */
  opened?: boolean;
  onClose?: () => void;
  button?: RenderCb;
  title?: string;
  children: ReactNode;
  /**
   * Footer-слот панели: прижат вниз карточки вне скролл-области контента
   * (consumer кладёт туда тумблер темы и выбор схемы — всегда видимы).
   */
  footer?: ReactNode;
  /**
   * Docked-режим («пристегнутый», без оверлея и бургера) — состояние извне:
   * канон Stage 5 — порог ширины живёт в apps/web/src/Root.tsx
   * (DOCK_THRESHOLD=1250), внутри Sidebar порогов размеров нет.
   * Без props.opened docked implies открытость.
   */
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
  footer?: ReactNode;
  docked?: boolean;
  /** Панель закрывается с анимацией ухода (round 15): slide-out/fade до
   * размонтирования; onExited — animationend карточки. */
  exiting?: boolean;
  onExited?: () => void;
}) {
  const { children, footer, actions, docked, exiting, onExited } = props;
  const modalRoot = useSidebarRoot();

  const closeIfUndocked = () => {
    if (!docked) {
      actions.close();
    }
  };
  // Drawer закрывается кликом по ПОВЕРХНОСТИ оверлея: клик внутри панели
  // всплывает сюда (карточка — ребёнок оверлея), но не должен его схлопывать
  // — иначе открытие native select в footer (выбор схемы) закрывает drawer.
  const onClickOverlay = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeIfUndocked();
    }
  };
  // Esc / Enter / Space закрывают сайдбар (паритет с кликом по оверлею).
  const onKeyDownOverlay = (e: KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      closeIfUndocked();
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
          <button> внутрь положить нельзя (карточка содержит собственные интерактивные элементы).
          Оверлей fixed (канон §2.2): панель не убегает при прокрутке страницы;
          drawer лок скролла body (Helmet ниже) — оверлей на весь viewport. */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: оверлей — поверхность «закрыть по клику», не интерактивный контрол */}
      <div
        tabIndex={-1}
        className={cx(
          css.sidebarOverlay,
          !docked && css.sidebarOverlayUndocked,
          exiting ? css.sidebarOverlayOut : !docked && css.sidebarOverlayIn,
        )}
        onClick={onClickOverlay}
        onKeyDown={onKeyDownOverlay}
      >
        {/* Хук data-ui="sidebar" — на панели внутри оверлея (не на оверлее:
            оверлей декоративный фон через токены; схемы мишатся на drawer —
            ширина/рамка/тень панели). */}
        <div
          className={cx(
            css.sidebarCard,
            exiting ? css.sidebarCardOut : !docked && css.sidebarCardIn,
          )}
          data-ui="sidebar"
          onAnimationEnd={exiting ? onExited : undefined}
        >
          {children}
        </div>
      </div>
    </>,
    modalRoot,
  );
}

export function Sidebar(props: SidebarProps) {
  // Docked — только извне (без внутренних порогов ширины, канон Stage 5);
  // открытость: явный props.opened, иначе docked implies открыт.
  const docked = Boolean(props.docked);
  const { opened = docked, button } = props;

  const [closed, setClose] = useState(!opened);
  // Уход с анимацией (round 15): closed гасит открытость сразу (onClose —
  // мгновенно, семантика consumer не меняется), панель доигрывает slide-out
  // до размонтирования: exiting живёт, пока идёт анимация ухода.
  const [exiting, setExiting] = useState(false);
  // Флаг mounted: анимация ухода только для панели, которая реально была
  // смонтирована (initial closed — не «доигрывать»).
  const wasMounted = useRef(opened);

  useEffect(() => {
    if (!exiting) {
      return;
    }
    const t = setTimeout(() => setExiting(false), 600);
    return () => clearTimeout(t);
  }, [exiting]);

  // Открытость извне (props.opened): закрытие — тот же pair closed+exiting,
  // но анимация ухода только если панель реально была смонтирована (wasMounted).
  useEffect(() => {
    const nextClosed = !opened;
    setClose(nextClosed);
    setExiting(nextClosed && wasMounted.current);
    wasMounted.current = !nextClosed;
  }, [opened]);

  useEffect(() => {
    if (closed && props.onClose) {
      props.onClose();
    }
  }, [closed, props]);

  const actions: SidebarActions = {
    open: () => {
      setClose(false);
      setExiting(false);
    },
    close: () => {
      setClose(true);
      setExiting(true);
    },
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
      {closed && !exiting ? null : (
        <SidebarContainer
          actions={actions}
          docked={docked}
          footer={props.footer}
          exiting={closed}
          onExited={() => setExiting(false)}
        >
          {/* Контрол закрытия (round 12): IconButton — канонический квадрат
           * (§3.1, icon-only дефолт 2.5rem), тот же глиф «close», что в Modal;
           * .sidebarClose — absolute в правом верхнем углу карточки поверх
           * меню (menu сдвинут наверх, шапка-строка убрана). solid (round
           * 14): непрозрачный фон --card — поверх меню не просвечивает. */}
          {docked ? null : (
            <IconButton
              className={css.sidebarClose}
              name="close"
              aria-label="Закрыть"
              onClick={actions.close}
              solid
            />
          )}
          {props.title ? <h2 className={textCss.heading}>{props.title}</h2> : null}
          {/* Контент — колонка пакета (css.sidebarContent: flex-1 +
              внутренний скролл min-h-0): длинный контент скроллится внутри
              карточки, не выезжая за неё; контролы consumer кладёт в
              footer-слот (прижат низу карточки, не скроллится). */}
          <div className={css.sidebarContent}>{props.children}</div>
          {props.footer ? <div className={css.sidebarFooter}>{props.footer}</div> : null}
        </SidebarContainer>
      )}
    </>
  );
}
