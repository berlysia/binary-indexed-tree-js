"use strict";
const assert = require('assert');

/**
 * @param {number} size
 */
function BinaryIndexedTree(size) {
    const bit = Array(size + 1).fill(0);

    function checkRange(x) {
        return 0 <= x && x < size;
    }

    /**
     * @param {number} idx - should be less than size of BIT
     * @param {number} val
     * @returns {boolean} successfully added or not
     * O(log(N))
     */
    this.add = function add(idx, val) {
        if (!checkRange(idx)) return false;
        idx++;
        for(let x = idx, l = bit.length - 1; x <= l; x += x & -x) {
            bit[x] += val;
        }
        return true;
    }

    /**
     * @param {number} idx - should be less than size of BIT
     * @returns {number} sum of range [0..idx]
     * O(log(N))
     */
    this.get = function get(idx) {
        if (!checkRange(idx)) return undefined;
        idx++;
        let ans = 0;
        for(let x = idx; x > 0; x -= x & -x) {
            ans += bit[x];
        }
        return ans;
    }

    /**
     * @returns {number} sum of range [0..size-1]
     * O(log(N))
     */
    this.sum = function sum() {
        return this.get(bit.length - 2);
    }

    function _comp(a, b) {
        return a < b;
    }

    function _wrap(fn) {
        return (a, b) => !fn(b, a);
    }

    /**
     * @param {number} target
     * @param {Function} comp
     * @param {number} begin - begin index of lower-bound
     * @param {number} end - end index of lower-bound
     * @returns {number} index of lower-bound
     * O(log(N) * log(N))
     */
    this.lowerBound = function(target, comp, begin, end) {
        begin = begin || 0;
        end = end || size;
        if(begin < 0 && size <= begin) throw new Error('out-of-bounds');
        if(end < 0 && size <= end) throw new Error('out-of-bounds');
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
    this.upperBound = function(target, comp, begin, end) {
        if(typeof comp !== 'function') comp = _comp;
        return this.lowerBound(target, _wrap(comp), begin, end);
    }
}

module.exports = BinaryIndexedTree;
