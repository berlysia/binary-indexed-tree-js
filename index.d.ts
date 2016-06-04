interface BinaryIndexedTree {
    length: number;
    add(idx: number, val: number): boolean;
    replace(idx: number, val: number): boolean;
    get(idx: number): number | void;
    prefix(idx: number): number | void;
    original(idx: number): number | void;
    sum(): number;
    lowerBound(target: number, comp?: (a: number, b: number) => boolean): number;
    upperBound(target: number, comp?: (a: number, b: number) => boolean): number;
    find(check: (item: number, index?: number, bit?: BinaryIndexedTree) => boolean): number | void;
    findIndex(check: (item: number, index?: number, bit?: BinaryIndexedTree) => boolean): number;
    indexOf(target: number): number;
    lastIndexOf(target: number): number;
    toArray(): Array<number>;
}

interface BinaryIndexedTreeStatic {
    new(size: number): BinaryIndexedTree;
    build(seed: Array<number>): BinaryIndexedTree
}

declare module 'binary-indexed-tree' {
    export default BinaryIndexedTreeStatic;
}
