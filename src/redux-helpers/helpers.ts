export function assertNever<TState>(state: TState, _: never): TState {
  return state;
}
