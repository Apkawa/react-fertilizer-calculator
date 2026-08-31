import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Text } from "./index";

const meta = { component: Text, title: "Components/Text" } satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: { children: "Текстовый блок. Типографика наследуется от body." },
} satisfies Story;
