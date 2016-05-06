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

class BinaryIndexedTree {

    /**
     * @param {number} size
     */
    constructor(size) {
        this.bit_ = Array(size).fill(0);
        this.length_ = size;
    }

    /**
     * @returns {number} size of BIT
     * real size of BIT is length + 1
     */
    get length() {
        return this.length_;
    }

    /**
     * @param {number} idx - should be less than size of BIT
     * @param {number} val
     * @returns {boolean} successfully added or not
     * O(log(N))
     */
    add(idx, val) {
        if (!checkRange(idx, this.length_)) return false;
        for(let x = idx, l = this.length; x < l; x |= x + 1) {
            this.bit_[x] += val;
        }
        return true;
    }

    /**
     * @param {number} idx - should be less than size of BIT
     * @returns {number} sum of range [0..idx]
     * O(log(N))
     */
    get(idx) {
        if (!checkRange(idx, this.length_)) return undefined;
        let ans = 0;
        for(let x = idx; x >= 0; x = (x & (x + 1)) - 1) {
            ans += this.bit_[x];
        }
        return ans;
    }

    /**
     * @returns {number} sum of range [0..size-1]
     * O(log(N))
     */
    sum() {
        return this.get(this.length_ - 1);
    }

    /**
     * @param {number} target
     * @param {Function} comp
     * @param {number} begin - begin index of lower-bound
     * @param {number} end - end index of lower-bound
     * @returns {number} index of lower-bound
     * [begin, end) - [1,2,3,4,5], begin = 1, end = 3 -> [2,3]
     * O(log(N) * log(N))
     */
    lowerBound(target, comp, begin, end) {
        begin = begin || 0;
        end = end || this.length_;
        if(!checkRange(begin, this.length_ + 1)) throw new Error('out-of-bounds');
        if(!checkRange(end, this.length_ + 1)) throw new Error('out-of-bounds');
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
     * @param {Array<number>} seed - BIT will be built from this array
     */
    static build(seed) {
        const ret = new BinaryIndexedTree(seed.length);
        for(let i = 0, l = seed.length; i < l; ++i) {
            ret.add(i, seed[i]);
        }
        return ret;
    }

    /**
     * @returns {Array<number>} array of cusum
     */
    toArray() {
        const result = Array(this.length_).fill(0);
        for(let i = 0, l = this.length_; i < l; ++i) {
            result[i] = this.get(i);
        }
        return result;
    }
}

module.exports = BinaryIndexedTree;
