export function formatCurrency(num: number | string) {
  if (typeof num === 'string') {
    num = parseFloat(num);
  }
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
