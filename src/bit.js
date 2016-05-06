"use strict";
const assert = require('assert');

function isOdd(num) {
    return num & 1;
}

function _comp(a, b) {
    return a < b;
}

function _wrap(fn) {
    return (a, b) => !fn(b, a);
}

function checkRange(x, end) {
    return 0 <= x && x < end;
}

function mostSignificantBit(num) {
    num |= (num >> 1);
    num |= (num >> 2);
    num |= (num >> 4);
    num |= (num >> 8);
    num |= (num >> 16);
    return num - (num >> 1);
}

function greaterPowerOfTwo(num) {
    const msb = mostSignificantBit(num);
    return msb << 1;
}

function lessPowerOfTwo(num) {
    const msb = mostSignificantBit(num);
    return msb >> 1;
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
    }

    /**
     * @param {Array<number>} seed - BIT will be built from this array
     * @returns {BinaryIndexedTree} instance
     * O(N)
     */
    static build(seed) {
        const ret = new BinaryIndexedTree(seed.length);
        for(let i = 0, l = seed.length; i < l; ++i) {
            ret._bit[i] = seed[i];
        }
        for(let i = 0, l = seed.length - 1; i < l; ++i) {
            ret._bit[i | (i + 1)] += ret._bit[i];
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
        if (!checkRange(idx, this.length)) return undefined;
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
        return this.get(this.length - 1);
    }

    /**
     * find lower bound.
     * SEQUENCE SHOULD BE INCREASING IN ORDER (GIVEN BY COMPERATOR).
     * IF ANY ITEM HAS MINUS VALUE, THIS METHOD WILL NOT WORK.
     * @param {number} target
     * @param {Function} [comp = (a, b) => a < b]
     * @returns {number} index of lower-bound
     * O(log(N))
     */
    lowerBound(target, comp) {
        const length = this.length;
        if(typeof comp !== 'function') comp = _comp;

        let ans = 0, k = greaterPowerOfTwo(target);
        while(k > 0) {
            if(checkRange(ans + k, length + 1) && comp(this._bit[ans + k - 1], target)) {
                target -= this._bit[ans + k - 1];
                ans |= k;
                k |= lessPowerOfTwo(k);
            } else {
                k = lessPowerOfTwo(k);
            }
        }

        return ans;
    }


    /**
     * find upper bound.
     * SEQUENCE SHOULD BE INCREASING IN ORDER (GIVEN BY COMPERATOR).
     * IF ANY ITEM HAS MINUS VALUE, THIS METHOD WILL NOT WORK.
     * @param {number} target
     * @param {Function} [comp = (a, b) => a < b]
     * @returns {number} index of upper-bound
     * O(log(N))
     */
    upperBound(target, comp) {
        if(typeof comp !== 'function') comp = _comp;
        return this.lowerBound(target, _wrap(comp));
    }

    /**
     * @returns {Array<number>} array of cusum
     * O(N)
     */
    toArray() {
        const result = Array(this.length).fill(0);

        for(let i = 1, l = this.length - 1; i < l; i *= 2) {
            result[i - 1] = 1; // mark pow2 values
        }

        let lastOdd = 0;
        for(let i = 0, l = this.length; i < l; ++i) {
            result[i] = this._bit[i] + (result[i] ? 0 : lastOdd);

            if(isOdd(i)) {
                lastOdd = result[i];
            }
        }
        return result;
    }
}
