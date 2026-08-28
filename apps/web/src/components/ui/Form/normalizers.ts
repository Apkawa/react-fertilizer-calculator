// Преобразователи значений форм (аналог normalize redux-form)
export function number(value: string): string | number {
  return value && parseInt(value);
}

export function decimal(value: string): string | number {
  return value && parseFloat(value);
}
