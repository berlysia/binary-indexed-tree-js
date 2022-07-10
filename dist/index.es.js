function isOdd(num) {
  return num & 1;
}
function _comp(a, b) {
  return a < b;
}
function _equal(a, b) {
  return a === b;
}
function _wrap(fn) {
  return (a, b) => !fn(b, a);
}
function checkRange(x, end) {
  return 0 <= x && x < end;
}
function checkPowerOfTwo(num) {
  if (num === 0)
    return false;
  return (num & num - 1) === 0;
}
function mostSignificantBit(num) {
  num |= num >> 1;
  num |= num >> 2;
  num |= num >> 4;
  num |= num >> 8;
  num |= num >> 16;
  num |= num >> 32;
  return num - (num >> 1);
}
function leastSignificantBit(num) {
  return num & -num;
}
function lowestCommonAncestor(a, b) {
  while (a % 2)
    a /= 2;
  while (b % 2)
    b /= 2;
  return a < b ? a : b;
}
class BinaryIndexedTree {
  constructor(size) {
    this._bit = Array(size).fill(0);
  }
  static build(seed) {
    const ret = new BinaryIndexedTree(seed.length);
    for (let i = 0, l = seed.length; i < l; ++i) {
      ret._bit[i] = seed[i];
    }
    for (let i = 0, l = seed.length - 1; i < l; ++i) {
      const t = i | i + 1;
      if (t <= l) {
        ret._bit[t] += ret._bit[i];
      }
    }
    return ret;
  }
  get length() {
    return this._bit.length;
  }
  add(idx, val) {
    if (!checkRange(idx, this.length))
      return false;
    for (let x = idx, l = this.length; x < l; x |= x + 1) {
      this._bit[x] += val;
    }
    return true;
  }
  update(idx, val) {
    if (!checkRange(idx, this.length))
      return false;
    const diff = val - this.original(idx);
    return this.add(idx, diff);
  }
  replace(idx, val) {
    return this.update(idx, val);
  }
  original(idx) {
    if (!checkRange(idx, this.length))
      return void 0;
    if (idx === 0)
      return this._bit[0];
    let ans = 0;
    const lca = lowestCommonAncestor(idx, idx - 1);
    for (let x = idx; x >= lca; x = (x & x + 1) - 1) {
      ans += this._bit[x];
    }
    for (let x = idx - 1; x >= lca; x = (x & x + 1) - 1) {
      ans -= this._bit[x];
    }
    return ans;
  }
  get(idx) {
    if (!checkRange(idx, this.length))
      return void 0;
    let ans = 0;
    for (let x = idx; x >= 0; x = (x & x + 1) - 1) {
      ans += this._bit[x];
    }
    return ans;
  }
  prefix(idx) {
    if (!checkRange(idx, this.length))
      return void 0;
    if (idx === 0)
      return 0;
    return this.get(idx - 1);
  }
  sum() {
    if (this.length === 0)
      return 0;
    return this.get(this.length - 1);
  }
  find(check) {
    if (typeof check !== "function")
      throw new TypeError();
    let value = this._bit[0];
    if (check(value, 0, this))
      return value;
    for (let idx = 1, l = this.length; idx < l; ++idx) {
      value += this.original(idx);
      if (check(value, idx, this))
        return value;
    }
    return void 0;
  }
  findIndex(check) {
    if (typeof check !== "function")
      throw new TypeError();
    let value = this._bit[0];
    if (check(value, 0, this))
      return 0;
    for (let idx = 1, l = this.length; idx < l; ++idx) {
      value += this.original(idx);
      if (check(value, idx, this))
        return idx;
    }
    return -1;
  }
  indexOf(target, equal) {
    if (typeof equal !== "function")
      equal = _equal;
    let value = this._bit[0];
    if (equal(value, target))
      return 0;
    for (let idx = 1, l = this.length; idx < l; ++idx) {
      value += this.original(idx);
      if (equal(value, target))
        return idx;
    }
    return -1;
  }
  lastIndexOf(target, equal) {
    if (typeof equal !== "function")
      equal = _equal;
    let value = this.sum();
    if (equal(value, target))
      return this.length - 1;
    for (let idx = this.length - 1; 0 < idx; --idx) {
      value -= this.original(idx);
      if (equal(value, target))
        return idx - 1;
    }
    return -1;
  }
  lowerBound(target, comp) {
    const length = this.length;
    if (typeof comp !== "function")
      comp = _comp;
    let ans = 0, x = mostSignificantBit(length) * 2;
    while (x && x === (x | 0)) {
      const lsb = leastSignificantBit(x);
      if (checkRange(x, length + 1) && comp(this._bit[x - 1], target)) {
        target -= this._bit[x - 1];
        ans = x;
        x += lsb / 2;
      } else {
        x += lsb / 2 - lsb;
      }
    }
    return ans;
  }
  upperBound(target, comp) {
    if (typeof comp !== "function")
      comp = _comp;
    return this.lowerBound(target, _wrap(comp));
  }
  toArray() {
    const result = Array(this.length).fill(0);
    for (let i = 0, l = this.length; i < l; ++i) {
      result[i] = this._bit[i];
    }
    for (let i = 2, l = this.length; i < l; ++i) {
      if (isOdd(i)) {
        if (!checkPowerOfTwo(i + 1)) {
          result[i] += result[(i & i + 1) - 1];
        }
      } else {
        result[i] += result[i - 1];
      }
    }
    return result;
  }
}
export { BinaryIndexedTree as default };
