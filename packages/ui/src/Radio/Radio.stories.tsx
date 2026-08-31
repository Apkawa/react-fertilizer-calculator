import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Radio } from "./index";

const meta = { component: Radio, title: "Components/Radio" } satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: { defaultChecked: true },
} satisfies Story;

export const Disabled = {
  args: { defaultChecked: true, disabled: true },
} satisfies Story;
