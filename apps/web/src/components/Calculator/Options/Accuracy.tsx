import { Card, Heading } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
import { decimal, Radio } from "@/components/ui/Form";

const ACCURACY_VARIANTS = [0.2, 0.1, 0.05, 0.01];
type AccuracyProps = {};

export const Accuracy: FunctionComponent<AccuracyProps> = () => {
  return (
    <Card>
      {/* Заголовок — канон Heading (h2, 1.125rem/600); радио-ряды — канон §3.6:
       * flex-wrap с gap ≥3; Radio из @fertilizer/ui даёт touch-цель ≥40px */}
      <Heading>Точность</Heading>
      <div className="flex flex-wrap gap-3">
        {ACCURACY_VARIANTS.map((a) => (
          <Radio key={a} name="accuracy" value={a} label={`${a} г.`} normalize={decimal} />
        ))}
      </div>
    </Card>
  );
};
