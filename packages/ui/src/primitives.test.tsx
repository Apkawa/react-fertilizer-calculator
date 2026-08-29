import { render } from "@testing-library/react";
import React from "react";
import { Button } from "./button";
import { Card } from "./card";
import { Label } from "./label";
import { Heading, Text } from "./text";

test("Label: оборачивает содержимое", () => {
  const { container } = render(<Label>Вес, г</Label>);
  const label = container.querySelector("label");
  expect(label).not.toBeNull();
  expect(label?.textContent).toBe("Вес, г");
});

test("Button: рендерит кнопку с текстом", () => {
  const { container } = render(<Button>Готово</Button>);
  const button = container.querySelector("button") as HTMLButtonElement;
  expect(button).not.toBeNull();
  expect(button.textContent).toBe("Готово");
});

test("Card: рендерит блок с содержимым", () => {
  const { container } = render(<Card>содержимое</Card>);
  expect(container.textContent).toBe("содержимое");
});

test("Text: рендерит div с текстом", () => {
  const { container } = render(<Text>текст</Text>);
  const div = container.querySelector("div");
  expect(div?.textContent).toBe("текст");
});

test("Heading: по умолчанию рендерит h2, тег меняется через as", () => {
  const { container } = render(<Heading>заголовок</Heading>);
  expect(container.querySelector("h2")?.textContent).toBe("заголовок");
  const { container: c2 } = render(<Heading as="h1">заголовок</Heading>);
  expect(c2.querySelector("h1")?.textContent).toBe("заголовок");
});
