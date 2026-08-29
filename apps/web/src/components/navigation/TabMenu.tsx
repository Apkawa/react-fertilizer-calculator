import { Sidebar } from "@fertilizer/ui";
import React from "react";
import { NavTab, RoutedTabs } from "react-router-tabs";
import { ColorModeToggle } from "@/components/ColorModeToggle";

import "./style.css";
import { useRouteMatch } from "react-router-dom";
import { type HelpPageListType, useHelpPagesList } from "@/pages/Help/pages";

type TabMenuProps = {};

// Верхнее меню приложения: роутинг (react-router-tabs) + страницы справки.
// Живёт в приложении, а не в @fertilizer/ui: зависит от роутера, Help и ColorModeToggle.
export function TabMenu(props: TabMenuProps) {
  return (
    <Sidebar>
      <RoutedTabs startPathWith={""} tabClassName="tab-link" activeTabClassName="active">
        <div className="flex flex-col">
          <NavTab exact to="/">
            Калькулятор
          </NavTab>
          <NavTab to="/fertilizers">Удобрения</NavTab>
          <NavTab to="/formula/">Парсер формул</NavTab>
          <NavTab to="/density/">Плотность</NavTab>
          <HelpPagesSubMenu />
        </div>
      </RoutedTabs>
      <ColorModeToggle />
    </Sidebar>
  );
}

export function RenderHelpPages(help_pages: HelpPageListType) {
  return (
    <ul>
      {help_pages.map((p) => (
        <>
          <li>
            <NavTab to={p.path} exact>
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
      <NavTab disabled to={""} isActive={() => !!match}>
        Справка
      </NavTab>
      {RenderHelpPages(help_pages)}
    </>
  );
}
