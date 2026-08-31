import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Card } from "./index";

const meta = { component: Card, title: "Components/Card" } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: { children: "Содержимое карточки" },
} satisfies Story;
