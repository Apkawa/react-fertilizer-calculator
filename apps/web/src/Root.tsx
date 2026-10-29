import { cx, useColorMode, useColorScheme, useWindowSize } from "@fertilizer/ui";
import React, { type FunctionComponent, useEffect, useState } from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import { TabMenu } from "@/components/navigation/TabMenu";
import pages from "./pages";

// Порог канона (design-guideline §2.1, style.css макета): от этой ширины
// сайдбар докнут (fixed-панель 300px), ниже — drawer с бургером.
const DOCK_THRESHOLD = 1250;

// Корневой компонент: без тем-провайдера (тема — CSS-переменные @fertilizer/ui)
// и без react-redux Provider (состояние — глобальный zustand-стор).
// Режим цвета и схема оформления живут здесь: применяются к <html> при
// монтировании, независимо от того, открыт ли сайдбар.
const Root: FunctionComponent = () => {
  const [colorMode, setColorMode] = useColorMode();
  const [schemeId, setSchemeId] = useColorScheme();
  const { width } = useWindowSize();
  const isWide = width >= DOCK_THRESHOLD;
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Переход в wide: drawer не нужен — сбрасываем (панель уже докнута).
  useEffect(() => {
    if (isWide) setDrawerOpen(false);
  }, [isWide]);

  // Канон §2.3: открытый drawer — класс drawer-open на <html> (app.css лок
  // скролла body). При закрытии или смене ширины класс снимается (cleanup).
  useEffect(() => {
    document.documentElement.classList.toggle("drawer-open", !isWide && drawerOpen);
    return () => document.documentElement.classList.remove("drawer-open");
  }, [isWide, drawerOpen]);

  return (
    <Router>
      {/* Рамка канона (§2.2): вертикальный стек на весь экран; при docked
          контент сдвинут на 300px панели + 8px легасной полосы — панель
          fixed из портала Sidebar (не убегает при прокрутке), вне потока. */}
      <div className={cx("flex flex-col min-h-screen", isWide && "pl-[308px]")}>
        {/* Header (доработка после Stage 8): бургер слева; тумблер темы и
            выбор схемы переехали вниз сайдбара (TabMenu), fork-баннер убран.
            Намерение темы/схемы по-прежнему владеет Root (хуки @fertilizer/ui),
            контролы — внутри панели сайдбара. */}
        <div className="flex items-center justify-between gap-2 px-4 py-2">
          <TabMenu
            docked={isWide}
            opened={isWide || drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onOpen={() => setDrawerOpen(true)}
            colorMode={colorMode}
            onColorModeChange={setColorMode}
            schemeId={schemeId}
            onSchemeChange={setSchemeId}
          />
        </div>
        {/* Контент-колонка канона (§2.2): max-width 936px, по центру. */}
        <div className="mx-auto w-full max-w-[936px] flex-1 px-4 pb-6">
          <Switch>
            <Route path={["/formula/:formula?/:percent?"]} component={pages.ChemFormula} />
            <Route
              path={["/density/:formula?/:concentration?/:density?/"]}
              component={pages.DensityCalculator}
            />
            <Route path="/help/:slug*" component={pages.Help} />
            <Route path="/" component={pages.Calculator} />
            <Route path="*" component={pages.NotFound} />
          </Switch>
        </div>
        {/* Футер версии: канон — мелкий текст muted, прижат вправо. */}
        <div className="mx-auto mt-auto flex w-full max-w-[936px] justify-end px-4 pb-6">
          <span className="text-sm text-[var(--muted)]">
            {__VERSION__}-{__COMMIT_REF_NAME__} {__COMMIT_HASH__} [{__COMMIT_DATE__}]
          </span>
        </div>
      </div>
    </Router>
  );
};

export default Root;
