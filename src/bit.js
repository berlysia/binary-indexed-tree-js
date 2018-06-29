"use strict";

import {
  isOdd,
  _comp,
  _equal,
  _wrap,
  checkRange,
  checkPowerOfTwo,
  mostSignificantBit,
  leastSignificantBit,
  lowestCommonAncestor
} from "./util";

/**
 * BinaryIndexedTree implementation
 */
export default class BinaryIndexedTree {
  /**
   * @param {number} size
   */
  constructor(size) {
    this._bit = Array(size).fill(0);
  }

  /**
   * @param {Array<number>} seed - BIT will be built from this array
   * @returns {BinaryIndexedTree} instance
   * O(N)
   */
  static build(seed) {
    const ret = new BinaryIndexedTree(seed.length);
    for (let i = 0, l = seed.length; i < l; ++i) {
      ret._bit[i] = seed[i];
    }
    for (let i = 0, l = seed.length - 1; i < l; ++i) {
      const t = i | (i + 1);
      if (t <= l) {
        ret._bit[t] += ret._bit[i];
      }
    }
    return ret;
  }

  /**
   * @returns {number} size of BIT
   */
  get length() {
    return this._bit.length;
  }

  /**
   * @param {number} idx - should be less than size of BIT
   * @param {number} val
   * @returns {boolean} successfully added or not
   * O(log(N))
   */
  add(idx, val) {
    if (!checkRange(idx, this.length)) return false;
    for (let x = idx, l = this.length; x < l; x |= x + 1) {
      this._bit[x] += val;
    }
    return true;
  }

  /**
   * @param {number} idx - should be less than size of BIT
   * @param {number} val
   * @returns {boolean} successfully updated or not
   * O(log(N))
   */
  update(idx, val) {
    if (!checkRange(idx, this.length)) return false;
    const diff = val - this.original(idx);
    return this.add(idx, diff);
  }

  replace(idx, val) {
    return this.update(idx, val);
  }

  /**
   * @param {number} idx - should be less than size of BIT
   * @returns {number} original value of array
   * O(log(N))
   */
  original(idx) {
    if (!checkRange(idx, this.length)) return undefined;
    if (idx === 0) return this._bit[0];
    let ans = 0;
    const lca = lowestCommonAncestor(idx, idx - 1);
    for (let x = idx; x >= lca; x = (x & (x + 1)) - 1) {
      ans += this._bit[x];
    }
    for (let x = idx - 1; x >= lca; x = (x & (x + 1)) - 1) {
      ans -= this._bit[x];
    }
    return ans;
  }

  /**
   * @param {number} idx - should be less than size of BIT
   * @returns {number} sum of range [0..idx]
   * O(log(N))
   */
  get(idx) {
    if (!checkRange(idx, this.length)) return undefined;
    let ans = 0;
    for (let x = idx; x >= 0; x = (x & (x + 1)) - 1) {
      ans += this._bit[x];
    }
    return ans;
  }

  /**
   * @param {number} idx - should be less than size of BIT
   * @returns {number} sum of range [0..idx)
   * O(log(N))
   */
  prefix(idx) {
    if (!checkRange(idx, this.length)) return undefined;
    if (idx === 0) return 0;
    return this.get(idx - 1);
  }

  /**
   * @returns {number} sum of all
   * O(log(N))
   */
  sum() {
    if (this.length === 0) return 0;
    return this.get(this.length - 1);
  }

  /**
   * linear search.
   * @param {Function} check function
   * @returns {number} value of first target, or undefined
   * O(N * log(N))
   */
  find(check) {
    if (typeof check !== "function") throw new TypeError();

    let value = this._bit[0];
    if (check(value, 0, this)) return value;

    for (let idx = 1, l = this.length; idx < l; ++idx) {
      value += this.original(idx);

      if (check(value, idx, this)) return value;
    }

    return undefined;
  }

  /**
   * linear search.
   * @param {Function} check function
   * @returns {number} index of first target, or -1
   * O(N * log(N))
   */
  findIndex(check) {
    if (typeof check !== "function") throw new TypeError();

    let value = this._bit[0];
    if (check(value, 0, this)) return 0;

    for (let idx = 1, l = this.length; idx < l; ++idx) {
      value += this.original(idx);

      if (check(value, idx, this)) return idx;
    }

    return -1;
  }

  /**
   * linear search.
   * @param {number} target value
   * @param {Function} [equal] - equality function
   * @returns {number} index of first target, or -1
   * O(N * log(N))
   */
  indexOf(target, equal) {
    if (typeof equal !== "function") equal = _equal;

    let value = this._bit[0];
    if (equal(value, target)) return 0;

    for (let idx = 1, l = this.length; idx < l; ++idx) {
      value += this.original(idx);

      if (equal(value, target)) return idx;
    }

    return -1;
  }

  /**
   * linear search.
   * @param {number} target value
   * @param {Function} [equal] - equality function
   * @returns {number} index of last target, or -1
   * O(N * log(N))
   */
  lastIndexOf(target, equal) {
    if (typeof equal !== "function") equal = _equal;

    let value = this.sum();
    if (equal(value, target)) return this.length - 1;

    for (let idx = this.length - 1; 0 < idx; --idx) {
      value -= this.original(idx);

      if (equal(value, target)) return idx - 1;
    }

    return -1;
  }

  /**
   * find lower bound.
   * SEQUENCE MUST BE STRICTLY SORTED.
   * @param {number} target
   * @param {Function} [comp]
   * @returns {number} index of lower-bound
   * O(log(N))
   */
  lowerBound(target, comp) {
    const length = this.length;
    if (typeof comp !== "function") comp = _comp;

    let ans = 0,
      x = mostSignificantBit(length) * 2;
    while (x && x === (x | 0)) {
      const lsb = leastSignificantBit(x);
      if (checkRange(x, length + 1) && comp(this._bit[x - 1], target)) {
        target -= this._bit[x - 1];
        ans = x;
        x += lsb / 2;
      } else {
        x += lsb / 2 - lsb;
      }
    }

    return ans;
  }

  /**
   * find upper bound.
   * SEQUENCE MUST BE STRICTLY SORTED.
   * @param {number} target
   * @param {Function} [comp]
   * @returns {number} index of upper-bound
   * O(log(N))
   */
  upperBound(target, comp) {
    if (typeof comp !== "function") comp = _comp;
    return this.lowerBound(target, _wrap(comp));
  }

  /**
   * @returns {Array<number>} array of cusum
   * O(N)
   */
  toArray() {
    const result = Array(this.length).fill(0);

    for (let i = 0, l = this.length; i < l; ++i) {
      result[i] = this._bit[i];
    }

    for (let i = 2, l = this.length; i < l; ++i) {
      if (isOdd(i)) {
        if (!checkPowerOfTwo(i + 1)) {
          result[i] += result[(i & (i + 1)) - 1];
        }
      } else {
        result[i] += result[i - 1];
      }
    }

    return result;
  }
}
