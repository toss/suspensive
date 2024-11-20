export type Override<TTarget, TObject> = Omit<TTarget, keyof TObject> & TObject
