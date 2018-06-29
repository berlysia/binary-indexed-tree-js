"use strict";
const assert = require("power-assert");
import Bucket from "../src/bucket";

function times(num, fn) {
  for (let i = 0; i < num; ++i) fn(i);
}

describe("BucketBinaryIndexedTree", function() {
  let bi;
  beforeEach(function() {
    bi = new Bucket({ bucketSize: 4 });
  });

  describe("instanciate", function() {
    for (let i = 1; i < 65; ++i) {
      it(`option.size ${i}`, function() {
        const b = new Bucket({ size: i });
        assert(b.length === i);
      });
    }
  });

  describe("get length()", function() {
    it("initialized", function() {
      assert(bi.length === 0);
    });

    it("append", function() {
      times(1, () => bi.append(1));
      assert(bi.length === 1);
    });

    it("append 5", function() {
      times(5, () => bi.append(1));
      assert(bi.length === 5);
    });

    it("prepend", function() {
      times(1, () => bi.prepend(1));
      assert(bi.length === 1);
    });

    it("prepend 5", function() {
      times(5, () => bi.prepend(1));
      assert(bi.length === 5);
    });

    it("append prepend", function() {
      times(5, () => bi.append(1));
      times(5, () => bi.prepend(1));
      assert(bi.length === 10);
    });
  });

  describe("get(index)", function() {
    it("append only", function() {
      times(5, () => bi.append(1));
      times(5, i => assert(bi.get(i) === i + 1));
    });

    it("prepend only", function() {
      times(5, () => bi.prepend(1));
      times(5, i => assert(bi.get(i) === i + 1));
    });

    it("append prepend", function() {
      times(5, () => bi.append(1));
      times(5, () => bi.prepend(1));
      times(10, i => assert(bi.get(i) === i + 1));
    });
  });

  describe("add(index, value)", function() {
    it("append only", function() {
      times(10, () => bi.append(1));
      bi.add(3, 1);
      bi.add(6, 1);

      times(3, i => assert(bi.get(i) === i + 1));
      times(3, i => assert(bi.get(3 + i) === i + 1 + 3 + 1));
      times(4, i => assert(bi.get(6 + i) === i + 1 + 6 + 2));
    });

    it("prepend only", function() {
      times(10, () => bi.prepend(1));
      bi.add(3, 1);
      bi.add(6, 1);

      times(3, i => assert(bi.get(i) === i + 1));
      times(3, i => assert(bi.get(3 + i) === i + 1 + 3 + 1));
      times(4, i => assert(bi.get(6 + i) === i + 1 + 6 + 2));
    });

    it("append prepend", function() {
      times(5, () => bi.append(1));
      times(5, () => bi.prepend(1));
      bi.add(3, 1);
      bi.add(6, 1);

      times(3, i => assert(bi.get(i) === i + 1));
      times(3, i => assert(bi.get(3 + i) === i + 1 + 3 + 1));
      times(4, i => assert(bi.get(6 + i) === i + 1 + 6 + 2));
    });
  });
});
