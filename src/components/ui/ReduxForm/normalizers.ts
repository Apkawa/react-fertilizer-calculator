

export function number(value: any) {
  return value && parseInt(value)
}

export function decimal(value: any, parts?: number) {
  return value && parseFloat(value)
}
