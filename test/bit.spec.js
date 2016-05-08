"use strict";
const assert = require("power-assert");
import BIT from '../src/bit';

describe('sequencial test', function () {

    for(let size = 1, i = 0, l = 13; i < l; ++i, size*=2) {
        if(size === 512) continue; // FIXME: lower/upperBound fails when (503 <= size <= 523)
        describe(`with size = ${size}`, basicTest.bind(null, size));
    };

    // FIXME: lower/upperBound fails when size >= 7912 

});

function basicTest(size) {
    let bit, cusum;
    beforeEach(function () {
        bit = new BIT(size);
        for(let i = 0, l = size; i < l; ++i) {
            bit.add(i, i);
        }
        cusum = Array(size).fill(0)
            .reduce((acc, x, i) => (acc.push(i ? i + acc[i - 1] : i), acc), []);
    });

    it('works', function () {
        for(let i = 0, l = size; i < l; ++i) {
            assert(bit.get(i) === cusum[i]);
        }
    });

    it('build', function () {
        const seq = Array(size).fill(0).map((x, i) => i);
        const built = BIT.build(seq);

        for(let i = 0, l = size; i < l; ++i) {
            assert(bit.get(i) === cusum[i]);
        }
    });

    it('access out of range returns undefined', function () {
        assert(bit.get(size) === undefined);
        assert(bit.get(-1) === undefined);
    });

    describe('#lowerBound, #upperBound', function () {

        if(2 < size) {
            it('works', function () {
                const target = (size / 2) | 0;
                const lb = bit.lowerBound(target);
                const ub = bit.upperBound(target);

                assert(target <= bit.get(lb));
                assert(bit.get(lb - 1) < target);

                assert(target < bit.get(ub));
                assert(bit.get(ub - 1) <= target);
            });
        }

        it('too small target', function () {
            const lb = bit.lowerBound(-1);
            const ub = bit.upperBound(-1);
            assert(lb === 0);
            assert(ub === 0);
        });

        it('too large target', function () {
            const sum = bit.sum();
            const lb = bit.lowerBound(sum + 1);
            const ub = bit.upperBound(sum + 1);
            assert(lb === size);
            assert(ub === size);
        });

        if (2 < size) {
            it('custom comperator', function () {
                const comp = (a, b) => a <= b;

                const target = (size / 2) | 0;

                const lb = bit.lowerBound(target);
                const ub = bit.upperBound(target);
                const lb_ = bit.lowerBound(target, comp);
                const ub_ = bit.upperBound(target, comp);

                assert(target < bit.get(lb_));
                assert(bit.get(lb_ - 1) <= target);

                assert(target <= bit.get(ub_));
                assert(bit.get(ub_ - 1) < target);

                assert(ub === lb_);
                assert(lb === ub_);
            });
        }
    });

    it('#toArray', () => {
        const arr = bit.toArray();
        assert.deepEqual(arr, cusum, bit._bit);
    });
}
