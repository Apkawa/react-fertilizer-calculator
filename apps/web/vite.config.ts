/// <reference types="node" />

import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { viteStaticCopy } from "vite-plugin-static-copy";
import packageJson from "./package.json";

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src");

/**
 * Инфа о сборке из git — 1:1 из старого getBuildInfo() в config-overrides.js.
 * Те же же константы инжектятся в бандл (ранее — через webpack.DefinePlugin).
 */
function getBuildInfo() {
  const [commitHash, isoDate, refNameLine] = execSync(
    "git show --no-patch --no-notes --pretty='%h;%cI;%D' HEAD",
  )
    .toString()
    .trim()
    .split(";");
  const m = refNameLine.match("HEAD -> (.+)");
  return {
    commitHash,
    isoDate,
    version: packageJson.version,
    // у detached HEAD ветки нет — старый код падал, здесь безопасный fallback
    refName: m ? m[1] : "HEAD",
  };
}

const buildInfo = getBuildInfo();

export default defineConfig({
  // Старое: `config.output.publicPath = './'` + PUBLIC_URL=./ — относительные пути,
  // чтобы сборка работала в подпапке GitHub Pages (деплой ветки → gh-pages/<branch>/).
  base: "./",
  resolve: {
    alias: {
      // Старое: config.resolve.alias['@'] → src/
      "@": srcDir,
    },
  },
  // Старый webpack.DefinePlugin: те же константы сборки.
  define: {
    __PUBLIC_PATH__: JSON.stringify("./"),
    __COMMIT_HASH__: JSON.stringify(buildInfo.commitHash),
    __VERSION__: JSON.stringify(buildInfo.version),
    __COMMIT_DATE__: JSON.stringify(buildInfo.isoDate),
    __COMMIT_REF_NAME__: JSON.stringify(buildInfo.refName),
  },
  plugins: [
    // tsconfig jsx: "react" (classic runtime); в каждом файле `import React`.
    react({ jsxRuntime: "classic" }),
    // Старый CopyPlugin: {from: 'docs/**/*.{jpg,png,jpeg}', context: 'src/'}
    // → картинки из src/docs копируются в build/docs/** (Help transformImageUri мапит на ./docs/<slug>/).
    // stripBase: 1 — убираем ведущий сегмент 'src/', чтобы путь под outDir совпал со старым.
    viteStaticCopy({
      targets: [
        {
          src: "src/docs/**/*.{jpg,png,jpeg}",
          dest: "",
          rename: { stripBase: 1 },
        },
      ],
    }),
    // PWA: generateSW (старый rewireWorkboxGenerate с дефолтными настройками).
    // vite-plugin-pwa сам инжектит регистрацию sw.js в index.html (injectRegister: 'auto').
    // Старый ручной register() (src/serviceWorker.ts) удалён.
    VitePWA({
      registerType: "auto",
    }),
  ],
  server: {
    // Старый dev-сервер CRA поднимался на :3000.
    port: 3000,
  },
  build: {
    // Workflow деплоит именно build/ (JamesIves/github-pages-deploy-action FOLDER: build).
    outDir: "build",
  },
});
