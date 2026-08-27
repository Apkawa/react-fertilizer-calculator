// Общие функции, потребляемые и приложением, и расчётным ядром, живут в пакете
// @fertilizer/calculator (единый источник); реэкспортируются, чтобы старые импорты
// приложения `@/utils` не менялись.
export {
  countDecimals,
  entries,
  keys,
  round,
  sum,
  tryParseFloat,
  values,
} from "@fertilizer/calculator/utils";

type ToMapResult<T> = { [K in string]: T };

export function toMap<T extends object>(list: T[], field: keyof T): ToMapResult<T> {
  const m: ToMapResult<T> = {};
  for (const i of list) {
    const key = i[field] as any as string;
    m[key] = i;
  }
  return m;
}

export function update<T extends object>(list: T[], item: T, lookup: keyof T): [T[], boolean] {
  const newList = [...list];
  let updated = false;
  for (let i = 0; i < list.length; i++) {
    if (newList[i][lookup] === item[lookup]) {
      newList[i] = item;
      updated = true;
      break;
    }
  }
  return [newList, updated];
}

export function updateOrPush<T extends object>(list: T[], item: T, lookup: keyof T): T[] {
  const [newList, updated] = update(list, item, lookup);
  if (!updated) {
    newList.push(item);
  }
  return newList;
}

export function equal(t1: any, t2: any): boolean {
  return JSON.stringify(t1) === JSON.stringify(t2);
}
