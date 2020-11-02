import React from "react";
import {NavTab, RoutedTabs} from "react-router-tabs";

import {Flex} from "rebass";

interface TabMenuProps {
}

export function TabMenu(props: TabMenuProps) {
    return (
        <>
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
        </>
    )
}
