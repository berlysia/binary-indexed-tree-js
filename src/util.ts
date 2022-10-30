export const isOdd = (num: number) => {
  return num & 1;
};

export const defaultCompare = (a: number, b: number): boolean => {
  return a < b;
};

export const defaultEqual = (a: number, b: number): boolean => {
  return a === b;
};

export const negate = <T>(fn: (a: T, b: T) => boolean) => {
  return (a: T, b: T) => !fn(b, a);
};

export const checkRange = (x: number, end: number): boolean => {
  return 0 <= x && x < end;
};

export const checkPowerOfTwo = (num: number): boolean => {
  if (num === 0) return false;
  return (num & (num - 1)) === 0;
};

export const mostSignificantBit = (num: number): number => {
  num |= num >> 1;
  num |= num >> 2;
  num |= num >> 4;
  num |= num >> 8;
  num |= num >> 16;
  num |= num >> 32;
  return num - (num >> 1);
};

export const leastSignificantBit = (num: number): number => {
  return num & -num;
};

export const lowestCommonAncestor = (a: number, b: number): number => {
  while (a % 2) a /= 2;
  while (b % 2) b /= 2;
  return a < b ? a : b;
};

export const buildArray = (length: number): number[] => {
  return Array.from({ length }, () => 0);
};
