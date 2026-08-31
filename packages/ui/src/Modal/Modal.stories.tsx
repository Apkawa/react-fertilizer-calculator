import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Button } from "../Button";
import { Text } from "../Text";
import { Modal, type ModalActions } from "./index";

// Рендер-кобэки (render-props): триггер открытия и содержимое окна
const renderButton = ({ modal }: { modal: ModalActions }) => (
  <Button onClick={() => modal.open()}>Открыть окно</Button>
);
const renderContainer = () => <Text>Содержимое модального окна</Text>;

const meta = { component: Modal, title: "Components/Modal" } satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: { opened: false, title: "Диалог", button: renderButton, container: renderContainer },
} satisfies Story;

export const Opened = {
  args: { opened: true, title: "Диалог", button: renderButton, container: renderContainer },
} satisfies Story;
