export type NestedKey<T> = {
  [K in keyof T]: T[K] extends object
    ? `${Extract<K, string>}.${NestedKey<T[K]>}` | Extract<K, string>
    : Extract<K, string>;
}[keyof T];
