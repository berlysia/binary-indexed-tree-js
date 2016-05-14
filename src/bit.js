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

function firstOne(num) {
    return num & (-num);
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
     * @param {Function} [comp]
     * @returns {number} index of lower-bound
     * O(log(N))
     */
    lowerBound(target, comp) {
        const length = this.length;
        if(typeof comp !== 'function') comp = _comp;

        let ans = 0, k = mostSignificantBit(length) * 2;
        while(k === (k | 0)) {
            const fo = firstOne(k);
            if(checkRange(k, length + 1) && comp(this._bit[k - 1], target)) {
                target -= this._bit[k - 1];
                ans = k;
                k += fo / 2;
            } else {
                k += (fo / 2) - fo;
            }
        }

        return ans;
    }


    /**
     * find upper bound.
     * SEQUENCE SHOULD BE INCREASING IN ORDER (GIVEN BY COMPERATOR).
     * IF ANY ITEM HAS MINUS VALUE, THIS METHOD WILL NOT WORK.
     * @param {number} target
     * @param {Function} [comp]
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

        for(let i = 0, l = this.length; i < l; ++i) {
            result[i] = this._bit[i];
        }

        for(let i = 2, l = this.length; i < l; ++i) {
            if(isOdd(i)) {
                const gp2 = mostSignificantBit(i) * 2;
                if(i !== gp2 - 1) {
                    result[i] += result[(i & (i + 1)) - 1];
                }
            } else {
                result[i] += result[i - 1];
            }
        }

        return result;
    }
}
