import React from "react";
import { renderApp } from "@/test-utils/render";
import { ForkMeOnGitHub } from "./ForkMeOnGitHub";

test("components/ui/ForkMeOnGitHub smoke: бейдж ссылки рендерится", () => {
  const { container } = renderApp(<ForkMeOnGitHub />);
  const link = container.querySelector("a");
  expect(link).not.toBeNull();
  expect(link?.getAttribute("href")).toContain("github.com/Apkawa/react-fertilizer-calculator");
}, 15000);
