import React from "react";
import { forkMeClass, forkMeLinkClass } from "./styles.css";

// Ленточка "Fork me on GitHub": span-обёртка + ссылка (адаптив по media-запросу).
export const ForkMeOnGitHub = () => {
  return (
    <span className={forkMeClass}>
      <a
        className={forkMeLinkClass}
        target="_blank"
        rel="noopener noreferrer"
        href={"https://github.com/Apkawa/react-fertilizer-calculator"}
      >
        Fork me on GitHub
      </a>
    </span>
  );
};
