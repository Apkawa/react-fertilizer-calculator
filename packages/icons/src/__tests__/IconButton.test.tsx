import React, { createRef } from "react";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import { renderIcons } from "../test-utils/render";

test("components/ui/IconButton smoke: кнопка с иконкой рендерится", () => {
  const { container } = renderIcons(<IconButton name="plus" title="Добавить" />);
  const button = container.querySelector("button");
  expect(button).not.toBeNull();
  expect(button?.querySelector("svg")).not.toBeNull();
});

test("components/ui/Icon smoke: иконка по имени рендерится в div со svg", () => {
  const { container } = renderIcons(<Icon name="trash" />);
  const div = container.querySelector("div");
  expect(div).not.toBeNull();
  const svg = div?.querySelector("svg");
  expect(svg).not.toBeNull();
  // e2e-контракт (playwright): svg — прямой ребёнок div-обёртки
  expect(svg?.parentElement).toBe(div);
});

// a11y (stage 2): именованный icon-only IconButton — доступное имя с кнопки,
// aria-label прокидывается до DOM-элемента (используется в местах вызова).
test("components/ui/IconButton: aria-label прокидывается как доступное имя", () => {
  const { container } = renderIcons(<IconButton name="plus" aria-label="Добавить" />);
  const button = container.querySelector("button");
  expect(button).not.toBeNull();
  expect(button?.getAttribute("aria-label")).toBe("Добавить");
});

// Тултип при наведении (round 7): кнопка без явного title получает его из
// aria-label; явный title — в приоритете.
test("components/ui/IconButton: title по умолчанию берётся из aria-label", () => {
  const { container } = renderIcons(
    <>
      <IconButton name="plus" aria-label="Добавить" />
      <IconButton name="trash" aria-label="Удалить" title="Удалить навсегда" />
    </>,
  );
  const [auto, explicit] = container.querySelectorAll("button");
  expect(auto?.getAttribute("title")).toBe("Добавить");
  expect(explicit?.getAttribute("title")).toBe("Удалить навсегда");
});

// Косметика (round 9): иконко-кнопка по умолчанию — канонический квадрат
// 2.5rem×2.5rem (§3.1): инлайн стиль перебивает padding базы Button; svg —
// 24px (1.5rem). Кнопка с children (текстом) — канон не форсируется.
test("components/ui/IconButton: icon-only — квадрат 2.5rem и svg 1.5rem по умолчанию", () => {
  const { container } = renderIcons(<IconButton name="plus" aria-label="Добавить" />);
  const button = container.querySelector("button")!;
  expect(button.style.width).toBe("2.5rem");
  expect(button.style.paddingLeft).toBe("0px");
  expect(button.style.paddingRight).toBe("0px");
  const svg = button.querySelector("svg")!;
  expect(svg.getAttribute("width")).toBe("1.5rem");
});

test("components/ui/IconButton: с children (текст) — ширина/padding не форсируются", () => {
  const { container } = renderIcons(
    <IconButton name="save" padding={1}>
      Отправить на миксер
    </IconButton>,
  );
  const button = container.querySelector("button")!;
  expect(button.style.width).toBe("");
  expect(button.className).toContain("p-1");
});

test("components/ui/IconButton: ref прокидывается до DOM-кнопки (ImportExport меряет offsetWidth)", () => {
  const ref = createRef<HTMLButtonElement>();
  renderIcons(
    <IconButton ref={ref} name="import">
      <input type="file" />
    </IconButton>,
  );
  expect(ref.current?.tagName).toBe("BUTTON");
  expect(ref.current?.querySelector("input")).not.toBeNull();
});

test("components/ui/IconButton: лёгасные layout-пропы → tailwind-классы (space-шкала polaris)", () => {
  const { container } = renderIcons(
    <IconButton
      name="plus"
      padding={1}
      alignSelf="center"
      marginRight={1}
      backgroundColor="primary"
    />,
  );
  const button = container.querySelector("button");
  expect(button).not.toBeNull();
  const cls = button?.className ?? "";
  // space-шкала [0,4,8,16,...]: индекс 1 → 4px → -1
  expect(cls).toContain("p-1");
  expect(cls).toContain("self-center");
  expect(cls).toContain("mr-1");
  // Токен темы → core-переменная @fertilizer/ui (arbitrary-класс, резолвится браузером)
  expect(cls).toContain("var(--primary)");
});

test("components/ui/IconButton: backgroundColor danger — токен, сырой цвет — style", () => {
  const { container } = renderIcons(
    <>
      <IconButton name="trash" backgroundColor="danger" />
      <IconButton name="save" backgroundColor="var(--ok)" />
    </>,
  );
  const [danger, raw] = container.querySelectorAll("button");
  expect(danger?.className).toContain("var(--danger)");
  // Сырое значение (не токен из BG_TOKENS) — проходит в inline style как есть
  expect(raw?.style.backgroundColor).toBe("var(--ok)");
});

// Косметика (round 14): solid — непрозрачный фон --card поверх контента под
// кнопкой (закрытие сайдбара просвечивало меню: база Button — прозрачный
// tint). Inline-фон (не tailwind-класс) — резолвится без сборки utilities.
test("components/ui/IconButton: solid — фон --card без прозрачности", () => {
  const { container } = renderIcons(<IconButton name="close" aria-label="Закрыть" solid />);
  const btn = container.querySelector("button");
  expect(btn?.style.backgroundColor).toBe("var(--card)");
});
