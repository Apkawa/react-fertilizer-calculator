import { Icon } from "@fertilizer/icons";
import React, {
  type ChangeEvent,
  type ComponentType,
  type Context,
  type CSSProperties,
  type KeyboardEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cx } from "../cx";
import "./style.css";

// ── Типы (переносятся из components/ui/Dropdown/types.d.ts) ──
export type ItemType<T> = T | null;
export type ItemCallback<T, R = void> = (item: ItemType<T>) => R;
export type RenderValueCallback<T> = ItemCallback<T, string>;
export type RenderItemCallback<T> = ComponentType<{ item: T; index: number }>;

interface DropdownContextInterface<T = any> {
  onItemClick?: ItemCallback<T>;
  renderItem?: RenderItemCallback<T>;
  checkDisabledItem?: ItemCallback<T, boolean>;
}

const DropdownContext: Context<DropdownContextInterface<any>> = React.createContext({});

// Счётчик для уникальных id списков: в React 16 нет useId,
// а id нужен для aria-controls (стабильный на время жизни инстанса).
let listboxIdCounter = 0;

// ── Пункт списка ──
// Клик по телу пункта выбирает значение (disabled-пункт кликом не выбирается).
// Клик-выбору есть клавиатурный эквивалент: пункт фокусируем (tabIndex=0)
// и выбирает его Enter/Space (a11y useKeyWithClickEvents). Кнопки внутри
// renderItem остаются своими: их обработчики делают stopPropagation, так
// что клик по контролу строки пункт не выбирает.
function DropdownItem<T>(props: { value: T; index: number; nodeRef?: React.Ref<HTMLDivElement> }) {
  const { value, index, nodeRef } = props;
  const ctx = useContext(DropdownContext);
  const disabled = ctx.checkDisabledItem ? Boolean(ctx.checkDisabledItem(value)) : false;

  const renderItem = () => {
    if (ctx.renderItem) {
      const RenderItem = ctx.renderItem;
      return <RenderItem item={value} index={index} />;
    }
    return value + "";
  };

  return (
    <div
      ref={nodeRef}
      role="option"
      tabIndex={disabled ? undefined : 0}
      onClick={disabled ? undefined : () => ctx.onItemClick?.(value)}
      // a11y: у пункта с onClick есть клавиатурный эквивалент (Enter/Space).
      onKeyDown={(event) => {
        if (disabled) {
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          ctx.onItemClick?.(value);
        }
      }}
      className={cx("ui-dropdown-item", disabled && "ui-dropdown-item--disabled")}
    >
      {renderItem()}
    </div>
  );
}

// ── Список (позиционируется внутри обёртки; max-height ограничивает высоту) ──
// a11y (stage 4): aria-required-children — прямыми детьми listbox являются только
// элементы role="option" (<hr>-разделители неинтерактивны); aria-input-field-name —
// доступное имя из label-пропа (триггер и список называются одинаково).
function DropdownList<T>(props: { items: T[]; listboxId: string; label?: string }) {
  const items = props.items;
  const itemRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(itemRef?.current?.offsetHeight || 0);
  }, []);

  return (
    <div
      id={props.listboxId}
      role="listbox"
      aria-label={props.label}
      className={cx("ui-dropdown-list", "flex flex-col")}
      style={{ maxHeight: height * 5 }}
    >
      {Array.from(items).map((s, i) => (
        <React.Fragment key={String(s)}>
          <DropdownItem<T> value={s} index={i} nodeRef={i === 0 ? itemRef : undefined} />
          {i < items.length - 1 ? <hr style={{ margin: 0 }} /> : null}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Дропдаун ──
export interface DropdownProps<T> {
  value?: ItemType<T>;
  items: T[];
  renderValue?: RenderValueCallback<T>;
  renderItem?: RenderItemCallback<T>;
  checkDisabledItem?: ItemCallback<T, boolean>;
  onEdit?: (value: string) => void;
  onChange?: (item: ItemType<T>) => void;
  width?: number;
  /** Доступное имя контрола (aria-label триггера и открытого списка) */
  label?: string;
}

export function Dropdown<T>(props: DropdownProps<T>) {
  const { width, label } = props;
  const renderValue: RenderValueCallback<T> = (item) => {
    if (props.renderValue) {
      return props.renderValue(item);
    }
    return (item || "") + "";
  };

  const [opened, setOpened] = useState(false);
  // Стабильный уникальный id списка (инициализатор useState — один раз на инстанс).
  const [listboxId] = useState(() => `dropdown-list-${++listboxIdCounter}`);
  const [item, setItem] = useState<ItemType<T> | null>(props.value || null);
  const [value, setValue] = useState(renderValue(props.value || null));
  const [editing, setEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as any)) {
        setOpened(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onClickItemHandler = (item: ItemType<T>) => {
    setItem(item);
    setValue(renderValue(item));
    props.onChange && props.onChange(item);
    setEditing(false);
    setOpened(false);
  };
  const onChangeInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setEditing(true);
    setOpened(false);
  };
  const onKeyDownInputHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      props.onEdit && props.onEdit(value);
    }
    if (event.key === "Escape") {
      onClickItemHandler(item);
    }
  };
  const onBlurInputHandler = () => {
    if (editing) {
      value && props.onEdit && props.onEdit(value);
    }
  };

  const context: DropdownContextInterface<T> = {
    onItemClick: onClickItemHandler,
    renderItem: props.renderItem,
    checkDisabledItem: props.checkDisabledItem,
  };

  const widthStyle: CSSProperties | undefined = width ? { width } : undefined;

  return (
    <DropdownContext.Provider value={context}>
      <div className="flex flex-col" style={widthStyle} ref={containerRef}>
        <div className="relative">
          <input
            type="text"
            // a11y (stage 4): семантика combobox — доступное имя (label-проп),
            // состояние раскрытия и ссылка на список (aria-controls).
            role="combobox"
            aria-expanded={opened}
            aria-controls={listboxId}
            aria-label={label}
            className="ui-input"
            value={value}
            onChange={onChangeInputHandler}
            onKeyDown={onKeyDownInputHandler}
            onBlur={onBlurInputHandler}
          />
          <div className="absolute right-0 top-0">
            {/* Шеврон — настоящая кнопка с именем (a11y stage 2);
                имя зависит от состояния: открыт/закрыт. */}
            <button
              type="button"
              className="ui-dropdown-chevron"
              aria-label={opened ? "Закрыть список" : "Открыть список"}
              onClick={() => setOpened(!opened)}
            >
              <Icon name="chevron-down" />
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute flex flex-col w-full">
            {opened && <DropdownList<T> items={props.items} listboxId={listboxId} label={label} />}
          </div>
        </div>
      </div>
    </DropdownContext.Provider>
  );
}
