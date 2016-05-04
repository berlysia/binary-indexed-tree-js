"use strict";
const assert = require("power-assert");
import BIT from '../src/bit';

describe('test', function () {
    let bit, size;
    beforeEach(function () {
        size = 10;
        bit = new BIT(size);
        for(let i = 0, l = size; i < l; ++i) {
            bit.add(i, i);
        }
    });

    it('works', function () {
        const cusum = Array(size).fill(0)
            .reduce((acc, x, i) => (acc.push(i ? i + acc[i - 1] : i), acc), []);
        for(let i = 0, l = size; i < l; ++i) {
            assert(bit.get(i) === cusum[i]);
        }
    });

    it('access out of range returns undefined', function () {
        assert(bit.get(size) === undefined);
        assert(bit.get(-1) === undefined);
    });

    describe('#lowerBound, #upperBound', function () {
        it('works', function () {
            const bit = new BIT(size);
            const target = 20;
            [10,0,0,0,10,0,0,0,10,0].forEach((x, i) => bit.add(i, x));
            const lb = bit.lowerBound(target);
            const ub = bit.upperBound(target);
            
            // [10, 10, 10, 10, 20, 20, 20, 20, 30, 30]
            //                  lb = 4          ub = 8

            assert(target <= bit.get(lb));
            assert(bit.get(lb - 1) < target);

            assert(target < bit.get(ub));
            assert(bit.get(ub - 1) <= target);

            assert(ub - lb === 4);
        });

        it('too small target', function () {
            const lb = bit.lowerBound(-1);
            const ub = bit.upperBound(-1);
            assert(lb === 0);
            assert(ub === 0);
        });

        it('too large target', function () {
            const lb = bit.lowerBound(bit.sum() + 1);
            const ub = bit.upperBound(bit.sum() + 1);
            assert(lb === size);
            assert(ub === size);
        });

        it('custom comperator', function () {
            const comp = (a, b) => a <= b;

            const bit = new BIT(size);
            const target = 20;
            [10,0,0,0,10,0,0,0,10,0].forEach((x, i) => bit.add(i, x));
            const lb = bit.lowerBound(target);
            const ub = bit.upperBound(target);
            const lb_ = bit.lowerBound(target, comp);
            const ub_ = bit.upperBound(target, comp);

            // [10, 10, 10, 10, 20, 20, 20, 20, 30, 30]
            //                  ub = 4          lb = 8

            assert(target < bit.get(lb_));
            assert(bit.get(lb_ - 1) <= target);

            assert(target <= bit.get(ub_));
            assert(bit.get(ub_ - 1) < target);

            assert(ub === lb_);
            assert(lb === ub_);
        });
    });
});
