import lodashIsEqual from "lodash.isequal";

export interface LooseObject {
  [key: string]: any;
}

export const isEqual = (value: any, other: any): boolean => {
  return lodashIsEqual(value, other);
};

export const run = <T>(f: () => T): T => {
  return f();
};

export const get = <K extends PropertyKey, V>(
  value: Record<K, V>,
  path: string,
  defaultValue: V | null = null
): V | null => {
  const segments = path.split(/[.[\]]/g);
  let current: any = value;

  for (const key of segments) {
    if (current === null) {
      return defaultValue;
    }

    if (current === undefined) {
      return defaultValue;
    }

    if (key.trim() === "") {
      continue;
    }

    current = current[key];
  }

  if (current === undefined) {
    return defaultValue;
  }

  return current;
};

export const isNil = (value: unknown): value is null | undefined => {
  return value === null || value === undefined;
};

export const isNull = (value: unknown): value is null => {
  return value === null;
};

export const isUndefined = (value: unknown): value is undefined => {
  return value === undefined;
};

export const isNumber = (value: any): value is number => {
  try {
    return Number(value) === value;
  } catch {
    return false;
  }
};

export const isFiniteNumber = (n: any) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

export const isString = (value: any): value is string => {
  return typeof value === "string" || value instanceof String;
};

export const isBoolean = (value: any): value is boolean => {
  return value === !!value;
};

export const isArray = (value: any): value is any[] => {
  return Array.isArray(value);
};

export const parseNumeric = (value: any): number | undefined => {
  const parsedValue = Number(value);
  return isNaN(parsedValue) ? undefined : parsedValue;
};

export const range = (start: number, end: number): number[] => {
  const result: number[] = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

export const chunk = <T>(list: T[], size: number): T[][] => {
  const chunkCount = Math.ceil(list.length / size);
  return new Array(chunkCount).fill(null).map((_c: null, i: number) => {
    return list.slice(i * size, i * size + size);
  });
};

export const first = <T>(
  array: T[],
  defaultValue: T | null | undefined = undefined
) => {
  return array?.length > 0 ? array[0] : defaultValue;
};

export const last = <T>(
  array: T[],
  defaultValue: T | null | undefined = undefined
) => {
  return array?.length > 0 ? array[array.length - 1] : defaultValue;
};

export const take = <T>(array: T[], count: number): T[] => {
  return array.slice(0, count);
};

export const isEmpty = <T>(array: T[]): boolean => {
  return array.length === 0;
};

export const mapValues = <TValue, TKey extends string, TNewValue>(
  obj: Record<TKey, TValue>,
  mapFunc: (value: TValue, key: TKey) => TNewValue
): Record<TKey, TNewValue> => {
  const keys = Object.keys(obj) as TKey[];
  return keys.reduce((acc, key) => {
    acc[key] = mapFunc(obj[key], key);
    return acc;
  }, {} as Record<TKey, TNewValue>);
};

export const orderBy = <T>(
  array: T[],
  predicate: (item: T) => any,
  order: "asc" | "desc" = "asc"
): T[] => {
  const compare = (a: T, b: T): number => {
    const valueA = predicate(a);
    const valueB = predicate(b);

    if (valueA < valueB) {
      return order === "asc" ? -1 : 1;
    }
    if (valueA > valueB) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  };

  return array.slice().sort(compare);
};

export const groupBy = <T, Key extends string | number | symbol>(
  array: T[],
  fn: (item: T) => Key
): Record<Key, T[]> => {
  return array.reduce((acc, item) => {
    const groupId = fn(item);
    if (!acc[groupId]) acc[groupId] = [];
    acc[groupId].push(item);
    return acc;
  }, {} as Record<Key, T[]>);
};

export const pickBy = <T extends LooseObject>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> => {
  return Object.keys(obj).reduce((result, key) => {
    const typedKey = key as keyof T;
    const value = obj[typedKey];

    if (predicate(value, typedKey)) {
      result[typedKey] = value;
    }

    return result;
  }, {} as Partial<T>);
};

export const compact = <A>(array: (A | undefined | null)[]): A[] => {
  return array.filter((v): v is A => v !== undefined && v !== null);
};

export const difference = <T>(array: T[], values: T[]): T[] => {
  return array.filter((x) => !values.includes(x));
};

export const intersect = <T>(array: T[], values: T[]): T[] => {
  const set = new Set(values);
  return array.filter((item) => set.has(item));
};

export const omit = <T, TKeys extends keyof T>(
  obj: T,
  keys: TKeys[]
): Omit<T, TKeys> => {
  if (!obj) {
    return {} as Omit<T, TKeys>;
  }

  if (!keys || keys.length === 0) {
    return obj as Omit<T, TKeys>;
  }

  return keys.reduce(
    (acc, key) => {
      delete acc[key];
      return acc;
    },
    { ...obj }
  );
};

export const omitBy = <T>(
  obj: Record<string, T>,
  predicate: (value: T, key: string) => boolean
): Record<string, T> => {
  return Object.keys(obj).reduce((result, key) => {
    if (!predicate(obj[key], key)) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Record<string, T>);
};

export const uniq = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const uniqBy = <T extends object>(
  arr: T[],
  keyFn: (item: T) => PropertyKey
) => {
  return arr.filter(
    (x, i, self) => i === self.findIndex((y) => keyFn(x) === keyFn(y))
  );
};

export const maxBy = <T>(
  array: T[],
  fn: (item: T) => number
): T | undefined => {
  if (array.length === 0) {
    return undefined;
  }

  let result = array[0];
  let max = fn(array[0]);

  for (let i = 1; i < array.length; i++) {
    const value = fn(array[i]);
    if (value > max) {
      max = value;
      result = array[i];
    }
  }
  return result;
};

export const keyBy = <T extends object, K extends PropertyKey>(
  array: T[],
  keyFn: (item: T) => PropertyKey
): { [P in K]: T } => {
  return array.reduce(
    (r, x) => ({ ...r, [keyFn(x)]: x }),
    {} as { [P in K]: T }
  );
};

export const listify = <TValue, TKey extends PropertyKey, TNewValue>(
  obj: Record<TKey, TValue>,
  mapFn: (value: TValue, key: TKey) => TNewValue
): TNewValue[] => {
  return Object.entries(obj).reduce<TNewValue[]>((acc, [key, value]) => {
    acc.push(mapFn(value as TValue, key as TKey));
    return acc;
  }, []);
};

export const identity = <T>(value: T): T => {
  return value;
};

export const constant = <T>(value: T) => {
  return () => value;
};

export const noop = (): void => {
  return;
};

export const memoize = <A = void, B = unknown>(
  f: (a: A) => B
): ((a: A) => B) => {
  const cache = new Map();

  return (a) => {
    if (!cache.has(a)) {
      const b = f(a);
      cache.set(a, b);
      return b;
    }
    return cache.get(a);
  };
};

export const round = (number: number, precision = 0) => {
  const factor = 10 ** precision;
  return Math.round(number * factor) / factor;
};

export const capitalize = (value: string) => {
  return `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;
};

export const exhaustiveMatchingGuard = (_: never): never => {
  throw new Error(`Matched case is not supported ${_}`);
};

export const toSentence = (arr: string[]) => {
  return (
    arr.slice(0, -2).join(", ") +
    (arr.slice(0, -2).length ? ", " : "") +
    arr.slice(-2).join(" and ")
  );
};

export const randomString = (length: number) => {
  return Math.random().toString(36).slice(2).slice(0, length);
};

export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const intersperse = <T>(arr: T[], separator: (n: number) => T): T[] =>
  arr.reduce<T[]>((acc, currentElement, currentIndex) => {
    const isLast = currentIndex === arr.length - 1;
    return [
      ...acc,
      currentElement,
      ...(isLast ? [] : [separator(currentIndex)]),
    ];
  }, []);

export const times = (count: number, f: (index: number) => void) => {
  for (let i = 0; i < count; i++) {
    f(i);
  }
};

export const moveArrayItem = <T>(
  array: T[],
  fromIndex: number,
  toIndex: number
) => {
  if (fromIndex < 0 || fromIndex > array.length) {
    throw new Error(
      `fromIndex must be between 0 and array length, you provided ${fromIndex}`
    );
  }

  if (toIndex < 0 || toIndex > array.length) {
    throw new Error(
      `toIndex must be between 0 and array length, you provided ${toIndex}`
    );
  }

  const clone = [...array];
  clone.splice(toIndex, 0, clone.splice(fromIndex, 1)[0]);
  return clone;
};

export const zeroPad = (num: number, places: number) => {
  return String(num).padStart(places, "0");
};

export const upperFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const zipObject = <A>(
  keys: string[],
  values: A[]
): Record<string, A> => {
  const result: Record<string, A> = {};

  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = values[i];
  }

  return result;
};

export const sum = (array: number[]): number => {
  let total = 0;

  for (let i = 0, n = array.length; i < n; ++i) {
    total += array[i];
  }

  return total;
};

// https://github.com/zebateira/node-deep-trim/blob/main/index.js
export const deepTrim = (object: any): any => {
  if (typeof object === "string") {
    return object.trim();
  } else if (typeof object === "object") {
    for (const key in object) {
      object[key] = deepTrim(object[key]);
    }
  }

  return object;
};

export const diffObjects = <K extends PropertyKey>(
  before: Record<K, any>,
  after: Record<K, any>
) => {
  const diff: Record<string, any> = {};

  Object.keys(before).forEach((key) => {
    if (!isEqual(before[key as K], after[key as K])) {
      diff[key] = { before: before[key as K], after: after[key as K] };
    }
  });

  Object.keys(after).forEach((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!before.hasOwnProperty(key)) {
      diff[key] = { before: undefined, after: after[key as K] };
    }
  });

  return omitBy(diff, isEmpty);
};
