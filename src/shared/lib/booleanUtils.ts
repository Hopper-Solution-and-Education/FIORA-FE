export class BooleanUtils {
  static choose<T>(condition: boolean, ifTrue: () => T, ifFalse: () => T): T {
    return condition ? ifTrue() : ifFalse();
  }

  static chooseByMap<T, K extends string | number>(
    key: K,
    map: Partial<Record<K, () => T>>, // Sử dụng Partial để không bắt buộc đủ keys
    defaultFn?: () => T,
  ): T {
    return map[key]
      ? map[key]()
      : defaultFn
        ? defaultFn()
        : (() => {
            throw new Error(`No handler for key: ${key}`);
          })();
  }
}
