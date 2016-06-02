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

function checkPowerOfTwo(num) {
    if (num === 0) return false;
    return (num & (num - 1)) === 0;
}

function mostSignificantBit(num) {
    num |= (num >> 1);
    num |= (num >> 2);
    num |= (num >> 4);
    num |= (num >> 8);
    num |= (num >> 16);
    num |= (num >> 32);
    return num - (num >> 1);
}

function leastSignificantBit(num) {
    return num & (-num);
}

// lowest common ancestor
function lowestCommonAncestor(a, b) {
    while(a % 2) a /= 2;
    while(b % 2) b /= 2;
    return a < b ? a : b;
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
            const t = i | (i + 1);
            if(t < l) {
                ret._bit[i | (i + 1)] += ret._bit[i];
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
        for(let x = idx, l = this.length; x < l; x |= x + 1) {
            this._bit[x] += val;
        }
        return true;
    }

    /**
     * @param {number} idx - should be less than size of BIT
     * @param {number} val
     * @returns {boolean} successfully replaced or not
     * O(log(N))
     */
    replace(idx, val) {
        if (!checkRange(idx, this.length)) return false;
        const diff = val - this.original(idx);
        return this.add(idx, diff);
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
        for(let x = idx; x >= lca; x = (x & (x + 1)) - 1) {
            ans += this._bit[x];
        }
        for(let x = idx - 1; x >= lca; x = (x & (x + 1)) - 1) {
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
        if(this.length === 0) return 0;
        return this.get(this.length - 1);
    }

    /**
     * linear search.
     * @param {Function} check function
     * @returns {number} value of first target, or undefined
     */
    find(check) {
        if(typeof check !== 'function') throw new TypeError();

        let value = this._bit[0];
        if(check(value)) return value;

        for (let x = 1, l = this.length; x < l; ++x) {
            value += this._bit[x];
            if (isOdd(x)) {
                if (checkPowerOfTwo(x + 1)) {
                    value -= this.get(x - 1);
                } else {
                    value -= this._bit[x - 1];
                }
            }

            if(check(value)) return value;
        }

        return undefined;
    }

    /**
     * linear search.
     * @param {Function} check function
     * @returns {number} index of first target, or -1
     */
    findIndex(check) {
        if(typeof check !== 'function') throw new TypeError();

        let value = this._bit[0];
        if(check(value)) return 0;

        for (let x = 1, l = this.length; x < l; ++x) {
            value += this._bit[x];
            if (isOdd(x)) {
                if (checkPowerOfTwo(x + 1)) {
                    value -= this.get(x - 1);
                } else {
                    value -= this._bit[x - 1];
                }
            }

            if(check(value)) return x;
        }

        return -1;
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

        let ans = 0, x = mostSignificantBit(length) * 2;
        while(x && x === (x | 0)) {
            const lsb = leastSignificantBit(x);
            if(checkRange(x, length + 1) && comp(this._bit[x - 1], target)) {
                target -= this._bit[x - 1];
                ans = x;
                x += lsb / 2;
            } else {
                x += (lsb / 2) - lsb;
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
                if(!checkPowerOfTwo(i + 1)) {
                    result[i] += result[(i & (i + 1)) - 1];
                }
            } else {
                result[i] += result[i - 1];
            }
        }

        return result;
    }
}
