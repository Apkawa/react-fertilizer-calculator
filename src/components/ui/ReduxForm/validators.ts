
type ValidatorCallback = {
  (value: any): void|string
}

export function pattern(pattern: RegExp|string, message?: string): ValidatorCallback {
  message = message || 'Значение должно соответствовать регулярному выражению'
  return (value) => {
    pattern = new RegExp(pattern) as RegExp
    if (pattern.test(value)) {
      return message
    }
  }
}

export function minLength(length: number, message?: string): ValidatorCallback {
  message = message || `Количество элементов должно быть не менее ${length}`

  return value => {
    if (value.length < length) {
      return message
    }
  }
}


export function required(message?: string): ValidatorCallback {
  message = message || `Должно быть заполнено`

  return value => {
    if (!value || !value?.length) {
      return message
    }
  }
}

