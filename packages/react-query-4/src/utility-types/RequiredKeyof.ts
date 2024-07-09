export type RequiredKeyof<T, TKey extends keyof T> = T & {
  [_ in TKey]: Record<never, never>
}
