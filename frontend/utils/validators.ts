export function oneOf<T extends readonly string[]>(options: T) {
  return (val: unknown): val is T[number] => {
    return typeof val === 'string' && options.includes(val as T[number])
  }
}
