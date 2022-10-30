export declare type Checker<
  InstanceType extends BinaryIndexedTreeInstance = BinaryIndexedTreeInstance
> = (item: number, index: number, self: InstanceType) => boolean;
export declare type Equality<T> = (a: T, b: T) => boolean;
export declare type Comparator<T> = (a: T, b: T) => boolean;

/**
 * BinaryIndexedTree interface
 */
export type BinaryIndexedTreeInstance = {
  /**
   * @returns {number} size of BIT
   */
  get length(): number;
  /**
   * @param {number} idx - should be less than size of BIT
   * @param {number} val
   * @returns {boolean} successfully added or not
   * O(log(N))
   */
  add(idx: number, val: number): boolean;
  /**
   * @param {number} idx - should be less than size of BIT
   * @param {number} val
   * @returns {boolean} successfully updated or not
   * O(log(N))
   */
  update(idx: number, val: number): boolean;
  replace(idx: number, val: number): boolean;
  /**
   * @param {number} idx - should be less than size of BIT
   * @returns {number} original value of array
   * O(log(N))
   */
  original(idx: number): number | undefined;
  /**
   * @param {number} idx - should be less than size of BIT
   * @returns {number} sum of range [0..idx]
   * O(log(N))
   */
  get(idx: number): number | undefined;
  /**
   * @param {number} idx - should be less than size of BIT
   * @returns {number} sum of range [0..idx)
   * O(log(N))
   */
  prefix(idx: number): number | undefined;
  /**
   * @returns {number} sum of all
   * O(log(N))
   */
  sum(): number;
  /**
   * linear search.
   * @param {Function} check function
   * @returns {number} value of first target, or undefined
   * O(N * log(N))
   */
  find(check: Checker): number | undefined;
  /**
   * linear search.
   * @param {Function} check function
   * @returns {number} index of first target, or -1
   * O(N * log(N))
   */
  findIndex(check: Checker): number;
  /**
   * linear search.
   * @param {number} target value
   * @param {Function} [equal] - equality function
   * @returns {number} index of first target, or -1
   * O(N * log(N))
   */
  indexOf(target: number, equal?: Equality<number>): number;
  /**
   * linear search.
   * @param {number} target value
   * @param {Function} [equal] - equality function
   * @returns {number} index of last target, or -1
   * O(N * log(N))
   */
  lastIndexOf(target: number, equal?: Equality<number>): number;
  /**
   * find lower bound.
   * SEQUENCE MUST BE STRICTLY SORTED.
   * @param {number} target
   * @param {Function} [comp]
   * @returns {number} index of lower-bound
   * O(log(N))
   */
  lowerBound(target: number, comp?: Comparator<number>): number;
  /**
   * find upper bound.
   * SEQUENCE MUST BE STRICTLY SORTED.
   * @param {number} target
   * @param {Function} [comp]
   * @returns {number} index of upper-bound
   * O(log(N))
   */
  upperBound(target: number, comp?: Comparator<number>): number;
  /**
   * @returns {Array<number>} array of cusum
   * O(N)
   */
  toArray(): number[];
};
