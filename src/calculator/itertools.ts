import {Permutation} from "js-combinatorics";

type GenericIterableIterator<T> = IterableIterator<{
  [K in keyof T]: T[K] extends Iterable<infer U> ? U : never
}>

export function* combination<T extends Array<any>>(iterable: T): GenericIterableIterator<T> {
  for (let p of new Permutation(iterable)) {
    yield p as any
  }
}

// NB: throws if any iterables passed to it are empty
// via https://gist.github.com/cybercase/db7dde901d7070c98c48#gistcomment-3033459
export function* product<T extends Array<Iterable<any>>>(...iterables: T): GenericIterableIterator<T> {
  if (iterables.length === 0) {
    return;
  }
  // make a list of iterators from the iterables
  const iterators = iterables.map(it => it[Symbol.iterator]());
  const results = iterators.map(it => it.next());
  if (results.some(r => r.done)) {
    throw new Error("Input contains an empty iterator.");
  }

  for (let i = 0; ;) {
    if (results[i].done) {
      // reset the current iterator
      iterators[i] = iterables[i][Symbol.iterator]();
      results[i] = iterators[i].next();
      // advance, and exit if we've reached the end
      if (++i >= iterators.length) {
        return;
      }
    } else {
      yield results.map(({value}) => value) as any;
      i = 0;
    }
    results[i] = iterators[i].next();
  }
}


