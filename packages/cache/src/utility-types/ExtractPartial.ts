export type ExtractPartial<TTarget extends Record<string, unknown>, TExtractor extends Partial<TTarget>> = Extract<
  TTarget,
  TExtractor
>
