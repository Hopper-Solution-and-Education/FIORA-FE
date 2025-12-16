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

  const clauses = values.map((value) => ({
    dynamicValue: { path: [jsonKey], equals: value },
  }));

  filters.OR = [...(filters.OR ?? []), ...clauses];
}
