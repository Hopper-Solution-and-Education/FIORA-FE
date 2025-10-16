export default function checkInputNumber(value: string) {
  if (/^\d+$/.test(value) || value === '') {
    return true;
  }

  return false;
}
