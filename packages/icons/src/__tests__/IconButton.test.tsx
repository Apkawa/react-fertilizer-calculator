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
  // Токен темы → CSS-переменная @fertilizer/ui (arbitrary-класс, резолвится браузером)
  expect(cls).toContain("var(--color-primary)");
});

test("components/ui/IconButton: backgroundColor danger — токен, сырой цвет — style", () => {
  const { container } = renderIcons(
    <>
      <IconButton name="trash" backgroundColor="danger" />
      <IconButton name="save" backgroundColor="#123456" />
    </>,
  );
  const [danger, raw] = container.querySelectorAll("button");
  expect(danger?.className).toContain("var(--color-danger)");
  expect(raw?.style.backgroundColor).toBe("rgb(18, 52, 86)");
});
