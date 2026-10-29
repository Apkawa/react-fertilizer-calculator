import { defaultSchema } from "hast-util-sanitize";
import React, { type FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";
import { Switch, useParams } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { LazyPromise } from "@/components/LazyPromise";
import { useHelpPageMap } from "@/pages/Help/pages";

import css from "./style.module.css";

// Справка = собственные статичные .md из src/docs: рендерим markdown и сырой HTML
// (rehype-raw), как раньше (v4 with-html). Sanitize — дефолтная схема + атрибут `style`
// для span (цвета в chem_table и т.п.), т.к. докам можно доверять.
const sanitizeSchema = {
  ...defaultSchema,
  attributes: { ...(defaultSchema.attributes ?? {}), span: ["style"] },
};

export const LazyHelpPage: FunctionComponent<{}> = () => {
  const { slug } = useParams<{ slug?: string }>();
  const pageMap = useHelpPageMap();
  const page = pageMap[slug || ""] || null;

  return (
    page && (
      <LazyPromise<string>
        lazy={page.lazy}
        component={({ result }) => (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            transformImageUri={(uri: string) => {
              const s = page.slug.split("/")[0];
              return uri.startsWith("http") ? uri : `./docs/${s}/${uri}`;
            }}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
          >
            {result || ""}
          </ReactMarkdown>
        )}
      />
    )
  );
};

type HelpProps = {};

// Контент Справки живёт в общей рамке Root (§2.2: max-w 936 px-4, по центру) —
// собственного контейнера ширины (легасный flex justify-center + inline
// max-width 960) здесь нет, типографика markdown — css.helpContent.
export const Help: FunctionComponent<HelpProps> = () => {
  return (
    <div className={css.helpContent}>
      <Switch>
        <LazyHelpPage />
      </Switch>
    </div>
  );
};
