import { waitFor } from "@testing-library/react";
import React from "react";
import { renderApp } from "@/test-utils/render";
import { LazyPromise } from "./LazyPromise";

// Смоук: промис разрешается → компонент рендерит результат.
test("components/LazyPromise smoke: ленивый результат рендерится", async () => {
  const { container } = renderApp(
    <LazyPromise<string>
      lazy={() => Promise.resolve("ленивый результат")}
      component={({ result }: { result: string }) => <div>{result}</div>}
    />,
  );
  await waitFor(
    () => {
      expect(container.textContent).toContain("ленивый результат");
    },
    { timeout: 5000 },
  );
}, 15000);
