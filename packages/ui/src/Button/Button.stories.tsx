import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Button } from "./index";

const meta = { component: Button, title: "Components/Button" } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: { children: "Кнопка" },
} satisfies Story;

export const Disabled = {
  args: { children: "Кнопка", disabled: true },
} satisfies Story;
