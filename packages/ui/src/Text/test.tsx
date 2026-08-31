import { render } from "@testing-library/react";
import React from "react";
import { Heading, Text } from "./index";

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
