export type NestedKey<T, Prefix extends string = ""> = {
  [K in Extract<keyof T, string>]: NonNullable<T[K]> extends object
    ? NonNullable<T[K]> extends Date
      ? `${Prefix}${K}` // Hindari eksplorasi properti Date
      : `${Prefix}${K}` | NestedKey<NonNullable<T[K]>, `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[Extract<keyof T, string>];

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];
