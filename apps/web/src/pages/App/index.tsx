import React from "react";
import css from "./App.module.css";
import logo from "./logo.svg";

function Index() {
  return (
    <div className={css.app}>
      <header className={css.appHeader}>
        <img src={logo} className={css.appLogo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className={css.appLink}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default Index;
