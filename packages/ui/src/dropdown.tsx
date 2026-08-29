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
import { cx } from "./cx";
import {
  dropdownChevronClass,
  dropdownItemClass,
  dropdownItemDisabledClass,
  dropdownListClass,
  inputClass,
} from "./styles.css";

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

// ── Пункт списка ──
function DropdownItem<T>(props: { value: T; index: number }) {
  const { value, index } = props;
  const ctx = useContext(DropdownContext);
  const disabled = ctx.checkDisabledItem ? Boolean(ctx.checkDisabledItem(value)) : false;

  const renderItem = () => {
    if (ctx.renderItem) {
      const RenderItem = ctx.renderItem;
      return <RenderItem item={value} index={index} />;
    }
    return value + "";
  };

  const onClickHandler = () => {
    if (ctx.onItemClick) {
      ctx.onItemClick(value);
    }
  };
  // Клавиатурный выбор (Enter/Space) — паритет с кликом.
  const onKeyDownHandler = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClickHandler();
    }
  };

  // role="option": пункт списка выбора (внутри может быть свой интерактивный контент,
  // напр. кнопка удаления — <button> в <button> недопустим).
  return (
    <div
      role="option"
      tabIndex={disabled ? -1 : 0}
      className={cx(dropdownItemClass, disabled && dropdownItemDisabledClass)}
      onClick={onClickHandler}
      onKeyDown={onKeyDownHandler}
    >
      {renderItem()}
    </div>
  );
}

// ── Список (позиционируется внутри обёртки; max-height ограничивает высоту) ──
function DropdownList<T>(props: { items: T[] }) {
  const items = props.items;
  const itemRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(itemRef?.current?.offsetHeight || 0);
  }, []);

  return (
    <div role="listbox" className={dropdownListClass} style={{ maxHeight: height * 5 }}>
      <div className="flex flex-col">
        {Array.from(items).map((s, i) => (
          <div ref={i === 0 ? itemRef : null} key={String(s)}>
            <DropdownItem<T> value={s} index={i} />
            {i < items.length - 1 ? <hr style={{ margin: 0 }} /> : null}
          </div>
        ))}
      </div>
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
}

export function Dropdown<T>(props: DropdownProps<T>) {
  const { width } = props;
  const renderValue: RenderValueCallback<T> = (item) => {
    if (props.renderValue) {
      return props.renderValue(item);
    }
    return (item || "") + "";
  };

  const [opened, setOpened] = useState(false);
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
            className={inputClass}
            value={value}
            onChange={onChangeInputHandler}
            onKeyDown={onKeyDownInputHandler}
            onBlur={onBlurInputHandler}
          />
          <div className="absolute right-0 top-0">
            <Icon
              name="chevron-down"
              className={dropdownChevronClass}
              onClick={() => setOpened(!opened)}
            />
          </div>
        </div>
        <div className="relative">
          <div className="absolute flex flex-col w-full">
            {opened && <DropdownList<T> items={props.items} />}
          </div>
        </div>
      </div>
    </DropdownContext.Provider>
  );
}
