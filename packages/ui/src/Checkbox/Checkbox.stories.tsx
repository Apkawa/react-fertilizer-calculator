import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Checkbox } from "./index";

const meta = { component: Checkbox, title: "Components/Checkbox" } satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Disabled = {
  args: { disabled: true },
} satisfies Story;
