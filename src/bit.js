"use strict";
const assert = require('assert');

function _comp(a, b) {
    return a < b;
}

function _wrap(fn) {
    return (a, b) => !fn(b, a);
}

function checkRange(x, end) {
    return 0 <= x && x < end;
}

/**
 * BinaryIndexedTree implementation
 */
export default class BinaryIndexedTree {

    /**
     * @param {number} size
     */
    constructor(size) {
        this._bit = Array(size).fill(0);
        this._length = size;
    }

    /**
     * @param {Array<number>} seed - BIT will be built from this array
     * @returns {BinaryIndexedTree} instance
     * O(N * log(N))
     */
    static build(seed) {
        const ret = new BinaryIndexedTree(seed.length);
        for(let i = 0, l = seed.length; i < l; ++i) {
            ret.add(i, seed[i]);
        }
        return ret;
    }

    /**
     * @returns {number} size of BIT
     */
    get length() {
        return this._length;
    }

    /**
     * @param {number} idx - should be less than size of BIT
     * @param {number} val
     * @returns {boolean} successfully added or not
     * O(log(N))
     */
    add(idx, val) {
        if (!checkRange(idx, this._length)) return false;
        for(let x = idx, l = this.length; x < l; x |= x + 1) {
            this._bit[x] += val;
        }
        return true;
    }

    /**
     * @param {number} idx - should be less than size of BIT
     * @returns {number} sum of range [0..idx]
     * O(log(N))
     */
    get(idx) {
        if (!checkRange(idx, this._length)) return undefined;
        let ans = 0;
        for(let x = idx; x >= 0; x = (x & (x + 1)) - 1) {
            ans += this._bit[x];
        }
        return ans;
    }

    /**
     * @returns {number} sum of range [0..size-1]
     * O(log(N))
     */
    sum() {
        return this.get(this._length - 1);
    }

    /**
     * find lower bound.
     * [begin, end) - [1,2,3,4,5], begin = 1, end = 3 -> [2,3]
     * @param {number} target
     * @param {Function} comp
     * @param {number} begin - begin index of lower-bound
     * @param {number} end - end index of lower-bound
     * @returns {number} index of lower-bound
     * O(log(N) * log(N))
     */
    lowerBound(target, comp, begin, end) {
        begin = begin || 0;
        end = end || this._length;
        if(!checkRange(begin, this._length + 1)) throw new Error(`Out of Bounds - begin: ${begin}, should be in [0, ${this._length})`);
        if(!checkRange(end, this._length + 1)) throw new Error(`Out of Bounds - end: ${end}, should be in [0, ${this._length})`);
        if(typeof comp !== 'function') comp = _comp;

        let mid;
        while (end - begin > 1) {
            mid = (begin + end) >> 1;
            if (comp(this.get(mid), target)) {
                begin = mid;
            } else {
                end = mid;
            }
        }
        return comp(this.get(begin), target) ? end : begin;
    }


    /**
     * find upper bound.
     * @param {number} target
     * @param {Function} comp
     * @param {number} begin - begin index of upper-bound
     * @param {number} end - end index of upper-bound
     * @returns {number} index of upper-bound
     * O(log(N) * log(N))
     */
    upperBound(target, comp, begin, end) {
        if(typeof comp !== 'function') comp = _comp;
        return this.lowerBound(target, _wrap(comp), begin, end);
    }

    /**
     * @returns {Array<number>} array of cusum
     * O(N * log(N))
     */
    toArray() {
        const result = Array(this._length).fill(0);
        for(let i = 0, l = this._length; i < l; ++i) {
            result[i] = this.get(i);
        }
        return result;
    }
}
