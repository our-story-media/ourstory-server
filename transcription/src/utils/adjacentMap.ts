/**
 * Given an array and a binary function,
 * Return a new array that is the result of calling the function
 * on adjacent items in the array
 */
const adjacentMap = <T extends unknown>(
  arr: T[],
  func: (a: T, b: T) => T
): T[] =>
  arr
    .reduce(
      (acc: [T, T][], val, ind, input) =>
        ind + 1 < input.length ? acc.concat([[val, input[ind + 1]]]) : acc,
      []
    )
    .map((pair) => func(pair[0], pair[1]));

export default adjacentMap;
