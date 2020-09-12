// https://habr.com/ru/company/alfa/blog/452620/

export type InferValuesTypes<T> = T extends { [key: string]: infer U } ? U : never
export type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown;
} ? U : T;

