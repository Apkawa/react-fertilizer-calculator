import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Dropdown } from "./index";

const items = ["Помидоры", "Огурцы", "Перец"];

const meta = { component: Dropdown, title: "Components/Dropdown" } satisfies Meta<typeof Dropdown>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: { items, label: "Культура", width: 200 },
} satisfies Story;

export const Selected = {
  args: { items, label: "Культура", value: "Огурцы" },
} satisfies Story;
