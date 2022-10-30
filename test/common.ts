import { Random, MersenneTwister19937 } from "random-js";
import { describe, beforeEach, it, expect } from "vitest";
import { BinaryIndexedTreeInstance } from "../src/types";

type InstanceContext = { size: number };
export type GetInstance<BIT extends BinaryIndexedTreeInstance> = (
  args: InstanceContext
) => BIT;

const maxArraySize = 7;
const randomSeed = [75938205, 57102950, 91702362];

export function sequentialInstanceTest<BIT extends BinaryIndexedTreeInstance>(
  getInstance: GetInstance<BIT>
) {
  describe("sequencial test", function () {
    describe(
      `with size = 0`,
      instanceTest.bind(null, getInstance, createSequencial(0))
    );

    for (let size = 1, i = 0, l = maxArraySize; i < l; ++i, size *= 2) {
      describe(
        `with size = ${size}`,
        instanceTest.bind(null, getInstance, createSequencial(size))
      );
    }
  });
}

export function randomInstanceTest<BIT extends BinaryIndexedTreeInstance>(
  getInstance: GetInstance<BIT>
) {
  describe("random test", function () {
    randomSeed.forEach((seed) => {
      for (let size = 1, i = 0, l = maxArraySize; i < l; ++i, size *= 2) {
        describe(
          `with size = ${size}`,
          instanceTest.bind(null, getInstance, createRandom(size, seed))
        );
      }
    });
  });
}

function lowerBoundExpected(cusum: number[], func: (item: number) => boolean) {
  let i = cusum.findIndex(func);
  if (!func(cusum[cusum.length - 1])) return cusum.length;
  return i;
}

export function createSequencial(size: number) {
  const ret = Array(size);
  for (let i = 0; i < size; ++i) ret[i] = i;
  return ret;
}

export function createRandom(size: number, seed: number): number[] {
  const max = (Number.MAX_SAFE_INTEGER / size) | 0;
  const random = new Random(MersenneTwister19937.seed(seed));
  return Array.from({ length: size }, () => random.integer(0, max));
}

function instanceTest<BIT extends BinaryIndexedTreeInstance>(
  getInstance: (args: InstanceContext) => BIT,
  seed: number[]
) {
  let bit: BIT,
    cusum: number[],
    size = seed.length;
  beforeEach(function () {
    bit = getInstance({ size });
    for (let i = 0, l = size; i < l; ++i) {
      bit.add(i, seed[i]);
    }
    cusum = seed.reduce<number[]>(
      (acc, x, i) => (acc.push(i ? x + acc[i - 1] : x), acc),
      []
    );
  });

  it("works", function () {
    for (let i = 0, l = size; i < l; ++i) {
      expect(bit.get(i)).toBe(cusum[i]);
    }
  });

  it("#original - original values", function () {
    for (let i = 0, l = size; i < l; ++i) {
      expect(bit.original(i)).toBe(seed[i]);
    }
  });

  it("access out of range returns undefined", function () {
    expect(bit.get(size)).toBe(undefined);
    expect(bit.get(-1)).toBe(undefined);
  });

  describe.runIf(size > 0)("#find", function () {
    it.each(createSequencial(size))(
      "works with each item with array (length=%i)",
      function (i) {
        const target = cusum[i];
        const message = `target: ${target}`;
        const fn = (x: number) => x > target;

        expect(cusum.find(fn), message).toBe(bit.find(fn));
      }
    );
  });

  describe.runIf(size > 0)("#findIndex", function () {
    it.each(createSequencial(size))(
      "works with each item with array (length=%i)",
      function (i) {
        const target = cusum[i];
        const message = `target: ${target}`;
        const fn = (x: number) => x > target;

        expect(cusum.findIndex(fn), message).toBe(bit.findIndex(fn));
      }
    );
  });

  describe.runIf(size > 0)("#indexOf", function () {
    it.each(createSequencial(size))(
      "works with each item with array (length=%i)",
      function (i) {
        const target = cusum[i];
        const message = `target: ${target}`;

        expect(cusum.indexOf(target), message).toBe(bit.indexOf(target));
      }
    );
  });

  describe.runIf(size > 0)("#lastIndexOf", function () {
    it.each(createSequencial(size))(
      "works with each item with array (length=%i)",
      function (i) {
        const target = cusum[i];
        const message = `target: ${target}`;

        expect(cusum.lastIndexOf(target), message).toBe(
          bit.lastIndexOf(target)
        );
      }
    );
  });

  describe("#lowerBound, #upperBound", function () {
    describe.runIf(size > 0)("each item", function () {
      it.each(createSequencial(size))(
        "works with array (length=%i)",
        function (i) {
          const target = cusum[i];
          const message = "target: " + target;
          const lb = bit.lowerBound(target);
          const ub = bit.upperBound(target);

          const expected_lb = lowerBoundExpected(cusum, (x) => target <= x);
          const expected_ub = lowerBoundExpected(cusum, (x) => target < x);

          expect(expected_lb, message).toBe(lb);
          expect(expected_ub, message).toBe(ub);
        }
      );
    });

    it("too small target", function () {
      const target = -1;
      const message = "target: " + target;
      const lb = bit.lowerBound(target);
      const ub = bit.upperBound(target);
      expect(lb, message).toBe(0);
      expect(ub, message).toBe(0);

      const expected_lb = lowerBoundExpected(cusum, (x) => target <= x);
      const expected_ub = lowerBoundExpected(cusum, (x) => target < x);

      expect(expected_lb, message).toBe(lb);
      expect(expected_ub, message).toBe(ub);
    });

    it("too large target", function () {
      const target = bit.sum() + 1;
      const lb = bit.lowerBound(target);
      const ub = bit.upperBound(target);

      expect(lb).toBe(size);
      expect(ub).toBe(size);
    });

    it.runIf(2 < size)("custom comperator", function () {
      const comp = (a: number, b: number) => a <= b;

      const target = (size / 2) | 0;

      const lb = bit.lowerBound(target);
      const ub = bit.upperBound(target);
      const lb_ = bit.lowerBound(target, comp);
      const ub_ = bit.upperBound(target, comp);

      expect(ub).toBe(lb_);
      expect(lb).toBe(ub_);
    });
  });

  it("#toArray", () => {
    const arr = bit.toArray();
    expect(arr).toEqual(cusum);
  });
}
