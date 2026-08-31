import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { ForkMeOnGitHub } from "./index";

const meta = {
  component: ForkMeOnGitHub,
  title: "Components/ForkMeOnGitHub",
} satisfies Meta<typeof ForkMeOnGitHub>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
