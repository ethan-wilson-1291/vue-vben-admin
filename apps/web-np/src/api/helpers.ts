export function calcPercentage(a: number, b: number) {
  if (!b) {
    return 0;
  }
  return ((a / b) * 100).toFixed(0);
}
