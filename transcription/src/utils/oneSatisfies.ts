
/**
 * Given an array and a predicate,
 * returns true if any of the array's elements satisfies the predicate,
 * otherwise, returns false
 * 
 * @param arr the array to search
 * @param pred the predicate to test for
 */
const oneSatisfies = <T extends unknown>(
  arr: T[],
  pred: (val: T) => boolean
): boolean => arr.filter(pred).length > 0;

export default oneSatisfies;
