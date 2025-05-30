export class BooleanUtils {
  static choose<T>(condition: boolean, ifTrue: () => T, ifFalse: () => T): T {
    return condition ? ifTrue() : ifFalse();
  }

  static chooseByMap<T, K extends string | number>(
    key: K,
    map: Partial<Record<K, () => T>>,
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

  static isTrue(value: unknown): boolean {
    return Boolean(value) === true;
  }

  static isFalse(value: unknown): boolean {
    return Boolean(value) === false;
  }

  static not(value: unknown): boolean {
    return !value;
  }
}
