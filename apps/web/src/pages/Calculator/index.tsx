import loadable from "@loadable/component";
import React, { type FunctionComponent } from "react";

// Страница Калькулятора: отдельный экран «Удобрения» (/fertilizers) убран —
// карточка merged в калькулятор (канон §3.1), поэтому вложенный Router
// не нужен: страница рендерит калькулятор напрямую (один маршрут).
const Calculator = loadable(() => import("@/components/Calculator"));

const CalculatorPage: FunctionComponent = () => <Calculator />;

export default CalculatorPage;
