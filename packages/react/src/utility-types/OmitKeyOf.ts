export type OmitKeyOf<TObject extends object, TKey extends keyof TObject> = Omit<TObject, TKey>
