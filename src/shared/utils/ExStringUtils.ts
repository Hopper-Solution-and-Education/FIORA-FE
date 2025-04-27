export function safeString(value: any): string {
  return typeof value === 'string' ? value : '';
}
