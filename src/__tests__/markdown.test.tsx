// Red-тест: целевой контракт = react-markdown v8 API (`children` + rehype-raw +
// кастомная sanitize-schema). Под текущим react-markdown@4 эти ассерты не выполняются:
// v4 знает только `source` (с /with-html), `rehypePlugins`/`children` не поддерживает,
// а rehype-raw/rehype-sanitize ещё не установлены.
import { render } from "@testing-library/react";
import { defaultSchema } from "hast-util-sanitize";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import howToUseMd from "@/docs/how_to_use.md?raw";
import chemTableMd from "@/docs/safety/chem_table.md?raw";

// defaultSchema + атрибут `style` для span (у доков — свои статичные тексты:
// цвета в chem_table должны рендериться; по умолчанию санитайзер `style` отбрасывает).
const styleSchema = {
  ...defaultSchema,
  attributes: { ...(defaultSchema.attributes ?? {}), span: ["style"] },
};

// Мини-копия того, как Help.tsx рендерит markdown (контракт, который закреплён тестом).
const MarkdownHelp: React.FC<{ markdown: string }> = (props) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeRaw, [rehypeSanitize, styleSchema]]}
  >
    {props.markdown}
  </ReactMarkdown>
);

test("markdown: таблица опасности (raw HTML) рендерится со стилями", () => {
  const { container } = render(<MarkdownHelp markdown={chemTableMd} />);
  // таблица markdown из доков
  const table = container.querySelector("table");
  expect(table).toBeTruthy();
  // сырой HTML `<span style="color:...">` должен дойти до DOM (rehype-raw + schema)
  const styledSpan = container.querySelector('span[style*="color"]');
  expect(styledSpan).toBeTruthy();
});

test("markdown: обычный markdown рендерится в заголовки", () => {
  const { container } = render(<MarkdownHelp markdown={howToUseMd} />);
  expect(container.querySelector("h1, h2")).toBeTruthy();
});
