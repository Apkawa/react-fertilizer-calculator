import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Label } from "./index";

const meta = { component: Label, title: "Components/Label" } satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

// Паттерн «label оборачивает контрол»: нативный чекбокс + текст подписи внутри
export const Default = {
  args: {
    children: (
      <>
        <input type="checkbox" />
        <span>Текст подписи</span>
      </>
    ),
  },
} satisfies Story;
