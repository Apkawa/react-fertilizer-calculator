

export function number(value: any) {
  return value && parseInt(value)
}

export function decimal(value: any) {
  return value && parseFloat(value)
}
