import React from "react";
import css from "./style.module.css";

// Ленточка "Fork me on GitHub": span-обёртка + ссылка (адаптив по media-запросу).
export const ForkMeOnGitHub = () => {
  return (
    <span className={css.forkMe}>
      <a
        className={css.forkMeLink}
        target="_blank"
        rel="noopener noreferrer"
        href={"https://github.com/Apkawa/react-fertilizer-calculator"}
      >
        Fork me on GitHub
      </a>
    </span>
  );
};
