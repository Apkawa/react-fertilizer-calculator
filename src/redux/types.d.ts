// https://habr.com/ru/company/alfa/blog/452620/
export type InferValuesTypes<T> = T extends { [key: string]: infer U } ? U : never

