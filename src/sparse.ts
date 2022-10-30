import {
  BinaryIndexedTreeInstance,
  Checker,
  Comparator,
  Equality,
} from "./types";
import {
  isOdd,
  defaultCompare,
  defaultEqual,
  negate,
  checkRange,
  checkPowerOfTwo,
  mostSignificantBit,
  leastSignificantBit,
  lowestCommonAncestor,
  buildArray,
} from "./util";

/**
 * SparseBinaryIndexedTree implementation
 */
export default class SparseBinaryIndexedTree
  implements BinaryIndexedTreeInstance
{
  private _bit: Record<number, number> = Object.create(null);

  constructor() {}

  /**
   * @param {Array<number>} seed - BIT will be built from this array
   * @returns {SparseBinaryIndexedTree} instance
   * O(N)
   */
  static build(seed: number[]): SparseBinaryIndexedTree {
    const ret = new SparseBinaryIndexedTree();
    for (let i = 0, l = seed.length; i < l; ++i) {
      ret._bit[i] = seed[i];
    }
    for (let i = 0, l = seed.length - 1; i < l; ++i) {
      const t = i | (i + 1);
      if (t <= l) {
        ret._bit[t] = ret._bit[i] ?? 0;
      }
    }
    return ret;
  }

  private _length = 0;

  /**
   * @returns {number} size of BIT
   */
  get length(): number {
    return this._length;
  }

  private updateLength(index: number): void {
    const newLength = index + 1;
    if (this._length < newLength) this._length = newLength;
  }

  private get poweredLength(): number {
    return mostSignificantBit(this.length) << 1;
  }

  private read(index: number): number {
    return this._bit[index] ?? 0;
  }

  /**
   * @param {number} idx - should be less than size of BIT
   * @param {number} val
   * @returns {boolean} successfully added or not
   * O(log(N))
   */
  add(idx: number, val: number): boolean {
    if (idx < 0) return false;
    this.updateLength(idx);
    for (let x = idx, l = this.poweredLength; x < l; x |= x + 1) {
      this._bit[x] = this.read(x) + val;
    }
    return true;
  }

  /**
   * @param {number} idx - should be less than size of BIT
   * @param {number} val
   * @returns {boolean} successfully updated or not
   * O(log(N))
   */
  update(idx: number, val: number): boolean {
    if (idx < 0) return false;
    const diff = val - this.original(idx)!;
    return this.add(idx, diff);
  }

  replace(idx: number, val: number) {
    return this.update(idx, val);
  }

  /**
   * @param {number} idx - should be less than size of BIT
   * @returns {number} original value of array
   * O(log(N))
   */
  original(idx: number): number | undefined {
    if (idx < 0) return undefined;
    if (idx === 0) return this.read(idx);
    let ans = 0;
    const lca = lowestCommonAncestor(idx, idx - 1);
    for (let x = idx; x >= lca; x = (x & (x + 1)) - 1) {
      ans += this.read(x);
    }
    for (let x = idx - 1; x >= lca; x = (x & (x + 1)) - 1) {
      ans -= this.read(x);
    }
    return ans;
  }

  /**
   * @param {number} idx - should be less than size of BIT
   * @returns {number} sum of range [0..idx]
   * O(log(N))
   */
  get(idx: number): number | undefined {
    if (idx < 0) return undefined;
    let ans = 0;
    for (let x = idx; x >= 0; x = (x & (x + 1)) - 1) {
      ans += this.read(x);
    }
    return ans;
  }

  /**
   * @param {number} idx - should be less than size of BIT
   * @returns {number} sum of range [0..idx)
   * O(log(N))
   */
  prefix(idx: number): number | undefined {
    if (idx < 0) return undefined;
    if (idx === 0) return 0;
    return this.get(idx - 1);
  }

  /**
   * @returns {number} sum of all
   * O(log(N))
   */
  sum(): number {
    if (this.length === 0) return 0;
    return this.get(this.length - 1)!;
  }

  /**
   * linear search.
   * @param {Function} check function
   * @returns {number} value of first target, or undefined
   * O(N * log(N))
   */
  find(check: Checker<SparseBinaryIndexedTree>): number | undefined {
    if (typeof check !== "function") throw new TypeError();

    let value = this.read(0);
    if (check(value, 0, this)) return value;

    for (let idx = 1, l = this.length; idx < l; ++idx) {
      value += this.original(idx)!;

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
  findIndex(check: Checker): number {
    if (typeof check !== "function") throw new TypeError();

    let value = this.read(0);
    if (check(value, 0, this)) return 0;

    for (let idx = 1, l = this.length; idx < l; ++idx) {
      value += this.original(idx)!;

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
  indexOf(target: number, equal: Equality<number> = defaultEqual): number {
    let value = this.read(0);
    if (equal(value, target)) return 0;

    for (let idx = 1, l = this.length; idx < l; ++idx) {
      value += this.original(idx)!;

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
  lastIndexOf(target: number, equal: Equality<number> = defaultEqual): number {
    let value = this.sum();
    if (equal(value, target)) return this.length - 1;

    for (let idx = this.length - 1; 0 < idx; --idx) {
      value -= this.original(idx)!;

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
  lowerBound(
    target: number,
    comp: Comparator<number> = defaultCompare
  ): number {
    const length = this.length;

    let ans = 0,
      x = mostSignificantBit(length) * 2;
    while (x && x === (x | 0)) {
      const lsb = leastSignificantBit(x);
      if (checkRange(x, length + 1) && comp(this.read(x - 1), target)) {
        target -= this.read(x - 1);
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
  upperBound(
    target: number,
    comp: Comparator<number> = defaultCompare
  ): number {
    return this.lowerBound(target, negate(comp));
  }

  /**
   * @returns {Array<number>} array of cusum
   * O(N)
   */
  toArray(): number[] {
    const result = buildArray(this.length);

    for (let i = 0, l = this.length; i < l; ++i) {
      result[i] = this.read(i);
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
