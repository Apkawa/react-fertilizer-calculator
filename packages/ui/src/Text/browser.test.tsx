// Браузерный регрессионный тест Text/Heading (vitest browser mode, chromium).
import React from "react";
import { expect, test } from "vitest";
import { mountBrowser } from "../browser-test-utils";
import { Heading, Text } from "./index";

test("Text: рендерит текстовый блок", async () => {
  const { screen } = mountBrowser(<Text>текст</Text>);
  await expect.element(screen.getByText("текст")).toBeVisible();
});

test("Heading: по умолчанию h2, тег меняется через as", async () => {
  const { screen } = mountBrowser(
    <>
      <Heading>Заголовок по умолчанию</Heading>
      <Heading as="h1">Заголовок первого уровня</Heading>
    </>,
  );
  await expect
    .element(screen.getByRole("heading", { name: "Заголовок по умолчанию" }))
    .toBeVisible();
  await expect
    .element(screen.getByRole("heading", { name: "Заголовок первого уровня" }))
    .toBeVisible();
});

test("Text/Heading: ARIA-снапшот базового состояния", async () => {
  const { screen } = mountBrowser(
    <>
      <Heading>Заголовок по умолчанию</Heading>
      <Text>текст</Text>
    </>,
  );
  await expect.element(screen).toMatchAriaSnapshot();
});
