import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { ElementCell } from "./index";

const meta = { component: ElementCell, title: "Components/ElementCell" } satisfies Meta<
  typeof ElementCell
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: { name: "K", value: "140", delta: "−49" },
} satisfies Story;

// Сетка результата — всегда 1 ряд × 8 (канон §3.3): дельты по знаку —
// «+» (--ok), «−» (--deficit), «0»/без дельты — нейтральная (--muted).
// render(args) (CSF3): первая ячейка управляется args/controls, остальной ряд — канон.
export const ResultRow = {
  args: { name: "NO3", value: "113", delta: "+2", className: "el-no3" },
  render: (args) => (
    <div className="flex flex-nowrap gap-2 overflow-hidden">
      <ElementCell {...args} />
      <ElementCell name="P" value="46" delta="−1.1" className="el-p" />
      <ElementCell name="K" value="140" delta="−49" className="el-k" />
      <ElementCell name="Ca" value="120" delta="+35" className="el-ca" />
      <ElementCell name="Mg" value="36" delta="0" className="el-mg" />
      <ElementCell name="S" value="12" className="el-s" />
      <ElementCell name="Fe" value="1.4" className="el-micro" />
      <ElementCell name="Cl" value="8" delta="+0.4" className="el-cl" />
    </div>
  ),
} satisfies Story;
