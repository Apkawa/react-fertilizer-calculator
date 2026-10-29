import { Icon } from "@fertilizer/icons";
import { type ColorMode, type SchemeId, Sidebar } from "@fertilizer/ui";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import { NavTab, RoutedTabs } from "react-router-tabs";
import { ColorModeToggle } from "@/components/ColorModeToggle";
import { SchemeSelect } from "@/components/SchemeSelect";
import { type HelpPageListType, useHelpPagesList } from "@/pages/Help/pages";
import css from "./style.module.css";

interface TabMenuProps {
  /** ≥1250px (порог канона §2.1): панель докнута, бургер не нужен. */
  docked?: boolean;
  /** Панель открыта: dock всегда открыт; drawer — по решению Root. */
  opened?: boolean;
  /** Закрытие drawer (оверлей/Esc/кнопка «Закрыть») — Root сбрасывает state. */
  onClose?: () => void;
  /** Открытие drawer: Root ставит drawerOpen=true (класс drawer-open, лок скролла). */
  onOpen?: () => void;
  /** Тумблер темы/выбор схемы — внизу панели (доработка после Stage 8); намерением владеет Root. */
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
  schemeId: SchemeId;
  onSchemeChange: (id: SchemeId) => void;
}

// Верхнее меню приложения: роутинг (react-router-tabs) + страницы справки.
// Живёт в приложении, а не в @fertilizer/ui: зависит от роутера и Help.
// Внизу панели — тумблер темы и выбор схемы (переехали из header после
// Stage 8: state у Root, здесь только рендер). Док/drawer решает Root
// (stage 5B, канон §2.2–2.3).
export function TabMenu({
  docked,
  opened,
  onClose,
  onOpen,
  colorMode,
  onColorModeChange,
  schemeId,
  onSchemeChange,
}: TabMenuProps) {
  return (
    <Sidebar
      docked={docked}
      opened={opened}
      onClose={onClose}
      // Бургер — канон .hamburger (§2.3): 2.5rem-квадрат на токенах; при docked
      // триггер не рендерится. Доступное имя «Меню» сохранено (локейтор e2e).
      button={({ modal }) =>
        docked ? null : (
          <button
            type="button"
            aria-label="Меню"
            className="inline-flex size-10 items-center justify-center rounded-[var(--radius)] border-[var(--border-width)] border-[var(--border)] bg-[var(--card)] text-[var(--text)]"
            onClick={() => {
              modal.open();
              onOpen?.();
            }}
          >
            <Icon size={24} name="menu" />
          </button>
        )
      }
      // Контролы темы/схемы — footer-слот панели (прижат низу карточки вне
      // скролл-области контента, всегда видимы): тумблер 42px + select h-10
      // (touch ≥40px); отступ сверху — css.sidebarFooter в @fertilizer/ui.
      footer={
        <div className="flex items-center gap-2">
          <ColorModeToggle colorMode={colorMode} onColorModeChange={onColorModeChange} />
          <SchemeSelect schemeId={schemeId} onChange={onSchemeChange} />
        </div>
      }
    >
      <RoutedTabs startPathWith={""} className={css.routerTabs} tabClassName="tab-link">
        {/* Клик по вкладке навигации закрывает drawer (round 10): оверлей
         * с Stage-поведения схлопывался всплытием ЛЮБОГО клика из панели —
         * теперь он закрыт по клику оверлея, и «уйти из меню» несёт
         * навигация. В docked onClose не нужен (панель постоянна). */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: обёртка навигации — surface «закрыть drawer при переходе», не интерактивный контрол; сами вкладки — <a> NavTab */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: Enter на ссылке NavTab порождает click (паритет); отдельный keydown не нужен */}
        <div
          className="flex flex-col"
          onClick={() => {
            if (!docked) onClose?.();
          }}
        >
          <NavTab className={css.navTab} activeClassName={css.active} exact to="/">
            Калькулятор
          </NavTab>
          {/* Вкладка «Удобрения» убрана: отдельный экран /fertilizers больше
           * нет — merged-карточка «Удобрения» живёт на странице калькулятора
           * (канон §3.1). */}
          <NavTab className={css.navTab} activeClassName={css.active} to="/formula/">
            Парсер формул
          </NavTab>
          <NavTab className={css.navTab} activeClassName={css.active} to="/density/">
            Плотность
          </NavTab>
          <HelpPagesSubMenu />
        </div>
      </RoutedTabs>
    </Sidebar>
  );
}

export function RenderHelpPages(help_pages: HelpPageListType) {
  return (
    <ul>
      {help_pages.map((p) => (
        <>
          <li>
            <NavTab activeClassName={css.active} className={css.navTab} to={p.path} exact>
              {p.name}
            </NavTab>
            {p.children.length ? RenderHelpPages(p.children) : null}
          </li>
        </>
      ))}
    </ul>
  );
}

export function HelpPagesSubMenu(props: {}) {
  const match = useRouteMatch<{ slug: string }>({
    path: "/help/:slug?",
  });
  const help_pages = useHelpPagesList();
  return (
    <>
      <NavTab
        activeClassName={css.active}
        className={css.navTab}
        disabled
        to={""}
        isActive={() => !!match}
      >
        Справка
      </NavTab>
      {RenderHelpPages(help_pages)}
    </>
  );
}
