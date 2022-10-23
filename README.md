# Binary Indexed Tree

Binary Indexed Tree(aka Fenwick Tree) implementation

## Install

Install with [yarn](https://yarnpkg.com/getting-started/install)

    $ yarn add binary-indexed-tree

Or with [npm](https://www.npmjs.com/)

    $ npm install binary-indexed-tree

## BIT?

Binary Indexed Tree (aka Fenwick Tree) is a data structure providing efficient methods for prefix-sum.

## API

### bit

BinaryIndexedTree implementation

### constructor

**Parameters**

-   `size` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### length

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** size of BIT

### add

**Parameters**

-   `idx` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** should be less than size of BIT
-   `val` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** successfully added or not
O(log(N))

### replace

**Parameters**

-   `idx` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** should be less than size of BIT
-   `val` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** successfully replaced or not
O(log(N))

### original

**Parameters**

-   `idx` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** should be less than size of BIT

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** original value of array
O(log(N))

### get

**Parameters**

-   `idx` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** should be less than size of BIT

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** sum of range [0..idx]
O(log(N))

### prefix

**Parameters**

-   `idx` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** should be less than size of BIT

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** sum of range \[0..idx)
O(log(N))

### sum

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** sum of all
O(log(N))

### find

linear search.

**Parameters**

-   `check` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** function

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** value of first target, or undefined
O(N \* log(N))

### findIndex

linear search.

**Parameters**

-   `check` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** function

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index of first target, or -1
O(N \* log(N))

### indexOf

linear search.

**Parameters**

-   `target` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** value
-   `equal` **\[[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)]** equality function

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index of first target, or -1
O(N \* log(N))

### lastIndexOf

linear search.

**Parameters**

-   `target` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** value
-   `equal` **\[[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)]** equality function

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index of last target, or -1
O(N \* log(N))

### lowerBound

find lower bound.
SEQUENCE SHOULD BE INCREASING IN ORDER (GIVEN BY COMPERATOR).
IF ANY ITEM HAS MINUS VALUE, THIS METHOD WILL NOT WORK.

**Parameters**

-   `target` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `comp` **\[[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)]** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index of lower-bound
O(log(N))

### upperBound

find upper bound.
SEQUENCE SHOULD BE INCREASING IN ORDER (GIVEN BY COMPERATOR).
IF ANY ITEM HAS MINUS VALUE, THIS METHOD WILL NOT WORK.

**Parameters**

-   `target` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `comp` **\[[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)]** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index of upper-bound
O(log(N))

### toArray

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** array of cusum
O(N)

### build

**Parameters**

-   `seed` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** BIT will be built from this array

Returns **BinaryIndexedTree** instance
O(N)

## Changelog

Read the [CHANGELOG](https://github.com/berlysia/binary-indexed-tree-js/blob/master/CHANGELOG.md).

## Running tests

Install devDependencies and Run
  `npm test`
  or
  `yarn test`

## Contributing

Pull requests and stars are always welcome.
For bugs and feature requests, [please create an issue](https://github.com/berlysia/binary-indexed-tree-js/issues).

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## License

Copyright © 2016-present berlysia.
Licensed under the MIT license.
