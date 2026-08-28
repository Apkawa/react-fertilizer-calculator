import React from "react";
import { SelectedList } from "./SelectedList";

// Обёртка секции: контроллируемый список удобрений из zustand-стора (без redux-form).
export const Container = () => {
  return <SelectedList />;
};
