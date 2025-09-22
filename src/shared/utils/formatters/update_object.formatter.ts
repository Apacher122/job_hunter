export function updateData<T extends Record<string, any>>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined && v !== null && v !== '')
  ) as Partial<T>;
}
