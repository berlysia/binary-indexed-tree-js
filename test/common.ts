import { Random, MersenneTwister19937 } from "random-js";
import { describe, beforeEach, it, expect } from "vitest";
import { BinaryIndexedTreeInstance } from "../src/types";

type InstanceContext = { size: number };
export type GetInstance<BIT extends BinaryIndexedTreeInstance> = (
  args: InstanceContext
) => BIT;

const arraySize = 64;
const randomSeed = [75938205, 57102950, 91702362];

export function sequentialInstanceTest<BIT extends BinaryIndexedTreeInstance>(
  getInstance: GetInstance<BIT>
) {
  describe("sequencial test", function () {
    describe(
      `with size = 0`,
      instanceTest.bind(null, getInstance, createSequencial(0))
    );

    describe(
      `with size = ${arraySize}`,
      instanceTest.bind(null, getInstance, createSequencial(arraySize))
    );
  });
}

export function randomInstanceTest<BIT extends BinaryIndexedTreeInstance>(
  getInstance: GetInstance<BIT>
) {
  describe("random test", function () {
    randomSeed.forEach((seed) => {
      describe(
        `with size = ${arraySize}`,
        instanceTest.bind(null, getInstance, createRandom(arraySize, seed))
      );
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

  it("#get", function () {
    // @ts-expect-error
    console.log(bit._bit);
    for (let index = 0, l = size; index < l; ++index) {
      const target = cusum[index];
      const message = `target: ${target}, index: ${index}`;
      expect(bit.get(index), message).toBe(target);
    }
  });

  it("#original - original values", function () {
    for (let index = 0, l = size; index < l; ++index) {
      const target = seed[index];
      const message = `target: ${target}, index: ${index}`;
      expect(bit.original(index), message).toBe(target);
    }
  });

  it("access out of range returns undefined", function () {
    expect(bit.get(size)).toBe(undefined);
    expect(bit.get(-1)).toBe(undefined);
  });

  describe.runIf(size > 0)("#find", function () {
    it("works with each item", function () {
      for (const index of createSequencial(size)) {
        const target = cusum[index];
        const fn = (x: number) => x > target;
        const message = `target: ${target}, index: ${index}`;

        expect(bit.find(fn), message).toBe(target);
      }
    });
  });

  describe.runIf(size > 0)("#findIndex", function () {
    it("works with each item", function () {
      for (const index of createSequencial(size)) {
        const target = cusum[index];
        const message = `target: ${target}, index: ${index}`;
        const fn = (x: number) => x > target;

        expect(bit.findIndex(fn), message).toBe(cusum.findIndex(fn));
      }
    });
  });

  describe.runIf(size > 0)("#indexOf", function () {
    it("works with each item", function () {
      for (const index of createSequencial(size)) {
        const target = cusum[index];
        const message = `target: ${target}, index: ${index}`;

        expect(bit.indexOf(target), message).toBe(cusum.indexOf(target));
      }
    });
  });

  describe.runIf(size > 0)("#lastIndexOf", function () {
    it("works with each item", function () {
      for (const index of createSequencial(size)) {
        const target = cusum[index];
        const message = `target: ${target}, index: ${index}`;

        expect(bit.lastIndexOf(target), message).toBe(
          cusum.lastIndexOf(target)
        );
      }
    });
  });

  describe("#lowerBound, #upperBound", function () {
    describe.runIf(size > 0)("each item", function () {
      it("works", function () {
        for (const index of createSequencial(size)) {
          const target = cusum[index];
          const message = "target: " + target;
          const lb = bit.lowerBound(target);
          const ub = bit.upperBound(target);

          const expected_lb = lowerBoundExpected(cusum, (x) => target <= x);
          const expected_ub = lowerBoundExpected(cusum, (x) => target < x);

          expect(lb, message).toBe(expected_lb);
          expect(ub, message).toBe(expected_ub);
        }
      });
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

      expect(lb, message).toBe(expected_lb);
      expect(ub, message).toBe(expected_ub);
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
