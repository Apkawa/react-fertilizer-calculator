import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Input } from "./index";

const meta = { component: Input, title: "Components/Input" } satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: { placeholder: "Введите значение" },
} satisfies Story;

export const Disabled = {
  args: { placeholder: "Введите значение", disabled: true },
} satisfies Story;
