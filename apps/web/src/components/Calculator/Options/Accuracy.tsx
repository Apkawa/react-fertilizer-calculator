import { Card, Heading } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
import { decimal, Radio } from "@/components/ui/Form";

const ACCURACY_VARIANTS = [0.2, 0.1, 0.05, 0.01];
type AccuracyProps = {};

export const Accuracy: FunctionComponent<AccuracyProps> = () => {
  return (
    <Card>
      <div className="flex flex-col">
        <Heading className="text-base">Точность</Heading>
        {ACCURACY_VARIANTS.map((a) => (
          <Radio key={a} name="accuracy" value={a} label={`${a} г.`} normalize={decimal} />
        ))}
      </div>
    </Card>
  );
};
