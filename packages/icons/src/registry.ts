import type { ComponentType } from "react";
import type { IconSvgProps } from "./base";
import { BroomIcon } from "./icons/broom";
import { ChevronDownIcon } from "./icons/chevronDown";
import { CloseIcon } from "./icons/close";
import { EditIcon } from "./icons/edit";
import { ExportIcon } from "./icons/export";
import { EyeIcon } from "./icons/eye";
import { EyeOffIcon } from "./icons/eyeOff";
import { GripIcon } from "./icons/grip";
import { ImportIcon } from "./icons/import";
import { MenuIcon } from "./icons/menu";
import { MonitorIcon } from "./icons/monitor";
import { MoonIcon } from "./icons/moon";
import { PlusIcon } from "./icons/plus";
import { RestartIcon } from "./icons/restart";
import { SaveIcon } from "./icons/save";
import { SunIcon } from "./icons/sun";
import { TrashIcon } from "./icons/trash";
import { TuneIcon } from "./icons/tune";

/**
 * Реестр собственных SVG-иконок: имя → компонент.
 * Только те иконки, которые реально используются приложением.
 */
export const icons: Record<string, ComponentType<IconSvgProps>> = {
  plus: PlusIcon,
  trash: TrashIcon,
  edit: EditIcon,
  import: ImportIcon,
  export: ExportIcon,
  save: SaveIcon,
  restart: RestartIcon,
  broom: BroomIcon,
  tune: TuneIcon,
  menu: MenuIcon,
  close: CloseIcon,
  sun: SunIcon,
  moon: MoonIcon,
  // «Система» — режим темы, следующий после sun/moon (redesign §5).
  monitor: MonitorIcon,
  "chevron-down": ChevronDownIcon,
  // Drag-handle ряда удобрения (6 точек, fill).
  grip: GripIcon,
  // Toggle фильтра списка удобрений: открыт = все ряды, закрыт = отмеченные.
  eye: EyeIcon,
  "eye-off": EyeOffIcon,
};

/** Имена собственных иконок (автодополнение prop `name`). */
export type IconName = keyof typeof icons;
