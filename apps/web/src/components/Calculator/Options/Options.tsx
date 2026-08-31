import { Button } from "@fertilizer/ui";
import React, { type ComponentType } from "react";
import { Accuracy } from "./Accuracy";
import { Dilution } from "./Dilution";
import { IgnoreElement } from "./IgnoreElement";
import { Solution } from "./Solution";
import { ToppingUp } from "./ToppingUp";

type OptionsProps = {};

export const Options: ComponentType<OptionsProps> = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-1">
        <Button className="my-2 w-full" type="submit">
          Calculate
        </Button>
      </div>
      <div className="my-2">
        <Solution />
      </div>
      <div className="my-2">
        <ToppingUp />
      </div>
      <div className="my-2">
        <Dilution />
      </div>
      <div className="[&>*]:flex-1">
        <IgnoreElement />
        <div className="ml-2">
          <Accuracy />
        </div>
      </div>
    </div>
  );
};
