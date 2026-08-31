import React from "react";
import "./style.css";

// Ленточка "Fork me on GitHub": span-обёртка + ссылка (адаптив по media-запросу).
export const ForkMeOnGitHub = () => {
  return (
    <span className="ui-fork-me">
      <a
        className="ui-fork-me-link"
        target="_blank"
        rel="noopener noreferrer"
        href={"https://github.com/Apkawa/react-fertilizer-calculator"}
      >
        Fork me on GitHub
      </a>
    </span>
  );
};
