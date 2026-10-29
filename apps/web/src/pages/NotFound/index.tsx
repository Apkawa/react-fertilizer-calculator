import { Card, Heading } from "@fertilizer/ui";
import React from "react";

// 404 для unreachable-роута (`*`) — канон §5: Card-обёртка + заголовок
// страницы h1 (иерархия Text/Heading, 1.5rem/600), юзер-текст RU.
export default () => (
  <Card>
    <Heading as="h1">Страница не найдена</Heading>
  </Card>
);
