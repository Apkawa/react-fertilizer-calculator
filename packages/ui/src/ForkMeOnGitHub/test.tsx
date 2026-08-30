import { render } from "@testing-library/react";
import React from "react";
import { ForkMeOnGitHub } from "./index";

test("ForkMeOnGitHub smoke: бейдж ссылки рендерится", () => {
  const { container } = render(<ForkMeOnGitHub />);
  const link = container.querySelector("a");
  expect(link).not.toBeNull();
  expect(link?.getAttribute("href")).toContain("github.com/Apkawa/react-fertilizer-calculator");
});
