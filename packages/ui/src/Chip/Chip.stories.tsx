import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Chip } from "./index";

const meta = { component: Chip, title: "Components/Chip" } satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: { label: "EC", value: "1.83" },
} satisfies Story;

// Баланс-ряд (plain): чанки в одну строку без переноса (канон §3.2);
// «ΔΣI» — подпись balance-чипа: символ Δ в подписи допустим (это не дельта).
// render(args) (CSF3): первый чип управляется args/controls, остальной ряд — канон.
export const BalanceRow = {
  args: { label: "ΔΣI", value: "194.7" },
  render: (args) => (
    <div className="flex flex-nowrap gap-2 overflow-hidden">
      <Chip {...args} />
      <Chip label="EC" value="1.83" />
      <Chip label="%NH4" value="34.6" />
      <Chip label="K:N" value="1.4" />
      <Chip label="K:Ca" value="1.9" />
      <Chip label="K:Mg" value="3.9" />
    </div>
  ),
} satisfies Story;

// Чипы состава удобрения (element): тон подложки/рамки — класс .el-* снаружи
// (наследуемый --el-tint из theme.css); текст не красится; ряд может переноситься.
export const ElementChipRow = {
  args: { label: "NO3", value: "113", variant: "element" as const, className: "el-no3" },
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Chip {...args} />
      <Chip label="NH4" value="96" variant="element" className="el-nh4" />
      <Chip label="P" value="46" variant="element" className="el-p" />
      <Chip label="K" value="140" variant="element" className="el-k" />
      <Chip label="Ca" value="120" variant="element" className="el-ca" />
      <Chip label="Mg" value="36" variant="element" className="el-mg" />
      <Chip label="S" value="12" variant="element" className="el-s" />
      <Chip label="Cl" value="8" variant="element" className="el-cl" />
      <Chip label="Fe" value="1.4" variant="element" className="el-micro" />
    </div>
  ),
} satisfies Story;
