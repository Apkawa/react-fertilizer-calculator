import { type ColorMode, Sidebar } from "@fertilizer/ui";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import { NavTab, RoutedTabs } from "react-router-tabs";
import { ColorModeToggle } from "@/components/ColorModeToggle";
import { type HelpPageListType, useHelpPagesList } from "@/pages/Help/pages";
import css from "./style.module.css";

type TabMenuProps = {
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
};

// Верхнее меню приложения: роутинг (react-router-tabs) + страницы справки.
// Живёт в приложении, а не в @fertilizer/ui: зависит от роутера, Help и ColorModeToggle.
export function TabMenu({ colorMode, onColorModeChange }: TabMenuProps) {
  return (
    <Sidebar>
      <RoutedTabs startPathWith={""} className={css.routerTabs} tabClassName="tab-link">
        <div className="flex flex-col">
          <NavTab className={css.navTab} activeClassName={css.active} exact to="/">
            Калькулятор
          </NavTab>
          <NavTab className={css.navTab} activeClassName={css.active} to="/fertilizers">
            Удобрения
          </NavTab>
          <NavTab className={css.navTab} activeClassName={css.active} to="/formula/">
            Парсер формул
          </NavTab>
          <NavTab className={css.navTab} activeClassName={css.active} to="/density/">
            Плотность
          </NavTab>
          <HelpPagesSubMenu />
        </div>
      </RoutedTabs>
      <ColorModeToggle colorMode={colorMode} onColorModeChange={onColorModeChange} />
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
