export function normalizeToArray(input?: string | string[]): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((s) => String(s).trim()).filter(Boolean);
  return String(input)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function applyJsonInFilter(filters: any, jsonKey: string, values: string[]) {
  if (!values || values.length === 0) return;
  const clause = { dynamicValue: { path: [jsonKey], in: values } } as const;
  filters.AND = [...(filters.AND ?? []), clause];
}
