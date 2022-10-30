export function isOdd(num: number) {
  return num & 1;
}

export function _comp(a: number, b: number): boolean {
  return a < b;
}

export function _equal(a: number, b: number): boolean {
  return a === b;
}

export function _wrap<T>(fn: (a: T, b: T) => boolean) {
  return (a: T, b: T) => !fn(b, a);
}

export function checkRange(x: number, end: number): boolean {
  return 0 <= x && x < end;
}

export function checkPowerOfTwo(num: number): boolean {
  if (num === 0) return false;
  return (num & (num - 1)) === 0;
}

export function mostSignificantBit(num: number): number {
  num |= num >> 1;
  num |= num >> 2;
  num |= num >> 4;
  num |= num >> 8;
  num |= num >> 16;
  num |= num >> 32;
  return num - (num >> 1);
}

export function leastSignificantBit(num: number): number {
  return num & -num;
}

export function lowestCommonAncestor(a: number, b: number): number {
  while (a % 2) a /= 2;
  while (b % 2) b /= 2;
  return a < b ? a : b;
}
