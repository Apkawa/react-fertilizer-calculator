import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Sidebar } from "./index";

const meta = { component: Sidebar, title: "Components/Sidebar" } satisfies Meta<typeof Sidebar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: { opened: false, title: "Меню", children: "Содержимое сайдбара" },
} satisfies Story;

export const Opened = {
  args: { opened: true, title: "Меню", children: "Содержимое сайдбара" },
} satisfies Story;
