import React from "react";
import {NavTab, RoutedTabs} from "react-router-tabs";

import {Flex} from "rebass";
import {Sidebar} from "@/components/ui/Sidebar/Sidebar";
import {ColorModeToggle} from "@/components/ColorModeToggle";

import "./style.css"

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
          <NavTab exact to="/">Calculate</NavTab>
          <NavTab to="/fertilizers">Fertilizers</NavTab>
          <NavTab to="/formula/">Formula</NavTab>
          <NavTab to="/help">Help</NavTab>
        </Flex>
      </RoutedTabs>
      <ColorModeToggle/>
    </Sidebar>
  )
}
