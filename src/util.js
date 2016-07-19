"use strict";

export function isOdd(num) {
    return num & 1;
}

export function _comp(a, b) {
    return a < b;
}

export function _equal(a, b) {
    return a === b;
}

export function _wrap(fn) {
    return (a, b) => !fn(b, a);
}

export function checkRange(x, end) {
    return 0 <= x && x < end;
}

export function checkPowerOfTwo(num) {
    if (num === 0) return false;
    return (num & (num - 1)) === 0;
}

export function mostSignificantBit(num) {
    num |= (num >> 1);
    num |= (num >> 2);
    num |= (num >> 4);
    num |= (num >> 8);
    num |= (num >> 16);
    num |= (num >> 32);
    return num - (num >> 1);
}

export function leastSignificantBit(num) {
    return num & (-num);
}

export function lowestCommonAncestor(a, b) {
    while(a % 2) a /= 2;
    while(b % 2) b /= 2;
    return a < b ? a : b;
}
