import React from "react";
import {NavTab, RoutedTabs} from "react-router-tabs";

import {Flex} from "rebass";
import {Sidebar} from "@/components/ui/Sidebar/Sidebar";
import {ColorModeToggle} from "@/components/ColorModeToggle";

import "./style.css"
import {HelpPageListType, useHelpPagesList} from "@/pages/Help/pages";
import {useRouteMatch} from "react-router-dom";

interface TabMenuProps {
}


export function TabMenu(props: TabMenuProps) {
  return (
    <Sidebar>
      <RoutedTabs
        startPathWith={''}
        tabClassName="tab-link"
        activeTabClassName="active"
      >
        <Flex flexDirection="column">
          <NavTab exact to="/">Калькулятор</NavTab>
          <NavTab to="/fertilizers">Удобрения</NavTab>
          <NavTab to="/formula/">Парсер формул</NavTab>
          <NavTab to="/density/">Плотность</NavTab>
          <HelpPagesSubMenu />
        </Flex>
      </RoutedTabs>
      <ColorModeToggle/>
    </Sidebar>
  )
}

export function RenderHelpPages(help_pages: HelpPageListType) {

  return (<ul>
    {help_pages.map(p => (
      <>
        <li>
          <NavTab to={p.path}>{p.name}</NavTab>
          {p.children.length? RenderHelpPages(p.children): null}
        </li>
      </>
    ))}
  </ul>
  )

}

export function HelpPagesSubMenu(props: {}) {
  const match = useRouteMatch<{ slug: string }>({
    path: "/help/:slug?",
  });
  const help_pages = useHelpPagesList()
  return (
    <>
      <NavTab disabled to={""} isActive={() => !!match}>Справка</NavTab>
      {RenderHelpPages(help_pages)}
    </>
  )
}
