"use strict";

import ArrayFrom from "array.from";

import BIT from "./bit";
import { _comp, _equal, _wrap, checkRange } from "./util";

export default class BucketBinaryIndexedTree {
  // _bucketBody: BIT[];
  // _bucketHead: BIT;
  // _bucketTail: BIT;
  // _bucketSize: number;
  // _firstIndex: number;
  // _lastIndex: number;

  constructor(option) {
    option = option || {};
    this._bucketSize = option.bucketSize ? option.bucketSize : 32;
    this._initialValue = option.initialValue ? option.initialValue : 0;

    this._bucketBody = [];
    this._bucketHead = this._newBucket();
    this._firstIndex = this._bucketSize;
    this._bucketTail = this._newBucket();

    if (option.size != null) {
      const div = (option.size / this._bucketSize) | 0,
        rem = (option.size % this._bucketSize) - 1;
      this._bucketBody.length = div;
      this._lastIndex = rem;
    } else {
      this._lastIndex = -1;
    }
  }

  _headSize() {
    return this._bucketSize - this._firstIndex;
  }

  _bodySize() {
    return this._bucketBody.length * this._bucketSize;
  }

  _tailSize() {
    return this._lastIndex + 1;
  }

  get length() {
    return this._headSize() + this._bodySize() + this._tailSize();
  }

  _newBucket() {
    return BIT.build(
      ArrayFrom({ length: this._bucketSize }, () => this._initialValue)
    );
  }

  _phantomBucket() {
    return {
      sum() {
        return this._bucketSize * this._initialValue;
      },
      get(i) {
        return i * this._initialValue;
      },
      prefix(i) {
        return i ? this.get(i - 1) : 0;
      }
    };
  }

  _findSumIndex(value) {
    return this._buckets.findIndex(x => x.sum());
  }

  _getReadonlyBody(idx) {
    if (this._bucketBody[idx] == null) {
      return this._phantomBucket();
    }
    return this._bucketBody[idx];
  }

  _getBody(idx) {
    if (this._bucketBody[idx] == null) {
      this._bucketBody[idx] = this._newBucket();
    }
    return this._bucketBody[idx];
  }

  get(index) {
    if (!checkRange(index, this.length)) return undefined;

    if (index < this._headSize()) {
      return (
        this._bucketHead.get((this._firstIndex % this._bucketSize) + index) -
        this._bucketHead.prefix(
          Math.max(0, this._firstIndex % this._bucketSize)
        )
      );
    }

    const ansHead =
      this._bucketHead.sum() -
      this._bucketHead.prefix(Math.max(0, this._firstIndex % this._bucketSize));
    const indexWithoutHead = index - this._headSize();

    const div = (indexWithoutHead / this._bucketSize) | 0,
      rem = indexWithoutHead % this._bucketSize;
    let ansBody = 0;

    for (let i = div - 1; 0 <= i; --i) {
      ansBody += this._getReadonlyBody(i).sum();
    }

    let ansTail = 0;
    if (div < this._bucketBody.length) {
      ansTail += this._getReadonlyBody(div).get(rem);
    } else {
      ansTail += this._bucketTail.get(rem);
    }

    return ansHead + ansBody + ansTail;
  }

  original(index) {
    if (!checkRange(index, this.length)) return undefined;

    if (index < this._headSize()) {
      return this._bucketHead.original(
        (this._firstIndex % this._bucketSize) + index
      );
    }

    index -= this._headSize();

    const div = (index / this._bucketSize) | 0,
      rem = index % this._bucketSize;

    if (div < this._bucketBody.length) {
      return this._getBody(div).original(rem);
    } else {
      return this._bucketTail.original(rem);
    }
  }

  prefix(index) {
    if (index === 0) return 0;
    return this.get(index - 1);
  }

  append(value) {
    if (this._lastIndex === this._bucketSize - 1) {
      this._bucketBody.push(this._bucketTail);
      this._bucketTail = this._newBucket();
      this._lastIndex = 0;
      return this._bucketTail.add(this._lastIndex, value);
    }

    return this._bucketTail.add(++this._lastIndex, value);
  }

  prepend(value) {
    if (this._firstIndex === 0) {
      this._bucketBody.unshift(this._bucketHead);
      this._bucketHead = this._newBucket();
      this._firstIndex = this._bucketSize - 1;
      return this._bucketHead.add(this._firstIndex, value);
    }

    return this._bucketHead.add(--this._firstIndex, value);
  }

  update(index, value) {
    if (!checkRange(index, this.length)) return false;

    const diff = value - this.original(index);
    return this.add(index, diff);
  }

  add(index, value) {
    if (!checkRange(index, this.length)) return undefined;

    if (index < this._headSize()) {
      return this._bucketHead.add(
        (this._firstIndex % this._bucketSize) + index,
        value
      );
    }

    index -= this._headSize();

    const div = (index / this._bucketSize) | 0,
      rem = index % this._bucketSize;

    if (div < this._bucketBody.length) {
      return this._getBody(div).add(rem, value);
    } else {
      return this._bucketTail.add(rem, value);
    }
  }

  indexOf(target, equal) {
    if (typeof equal !== "function") equal = _equal;

    const head = this._bucketHead.indexOf(target, equal);
    if (head > -1) return head;

    let body = -1;
    for (let i = 0, l = this._bucketBody.length; i < l; ++i) {
      const ans = this._bucketBody[i].indexOf(target, equal);
      if (ans > -1) {
        body = ans;
        break;
      }
    }
    if (body > -1) return body;

    const tail = this._bucketTail.indexOf(target, equal);
    return tail;
  }

  lastIndexOf(target, equal) {
    if (typeof equal !== "function") equal = _equal;

    const tail = this._bucketTail.lastIndexOf(target, equal);
    if (tail > -1) return tail;

    let body = -1;
    for (let i = this._bucketBody.length - 1; 0 <= i; --i) {
      const ans = this._bucketBody[i].lastIndexOf(target, equal);
      if (ans > -1) {
        body = ans;
        break;
      }
    }
    if (body > -1) return body;

    const head = this._bucketHead.lastIndexOf(target, equal);
    if (head > -1) return head;
  }
}
