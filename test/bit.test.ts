import { expect, test } from "vitest";
import BinaryIndexedTree from "../src/bit";
import {
  createRandom,
  GetInstance,
  randomInstanceTest,
  sequentialInstanceTest,
} from "./common";

const getInstance: GetInstance<BinaryIndexedTree> = (args) =>
  new BinaryIndexedTree(args.size);

sequentialInstanceTest(getInstance);

randomInstanceTest(getInstance);

test("static #build", function () {
  const size = 17;
  const seed = createRandom(size, 175622);
  const built = BinaryIndexedTree.build(seed);
  const bit = getInstance({ size });
  for (let i = 0; i < size; i++) bit.add(i, seed[i]);

  for (let i = 0, l = size; i < l; ++i) {
    expect(bit.get(i)).toBe(built.get(i));
  }
});
