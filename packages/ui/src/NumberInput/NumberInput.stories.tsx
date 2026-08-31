import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { NumberInput } from "./index";

const meta = { component: NumberInput, title: "Components/NumberInput" } satisfies Meta<
  typeof NumberInput
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: { value: 10, step: 1 },
} satisfies Story;

export const Disabled = {
  args: { value: 10, step: 1, disabled: true },
} satisfies Story;
