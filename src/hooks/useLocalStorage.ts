"use client";

export function useLocalStorage<T>(key: string, initial: T) {
  const get = (): T => {
    try {
      const s = localStorage.getItem(key);
      return s ? (JSON.parse(s) as T) : initial;
    } catch {
      return initial;
    }
  };
  const set = (val: T) => localStorage.setItem(key, JSON.stringify(val));
  return [get, set] as const;
}
