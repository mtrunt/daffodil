/**
 * A helper function to get the number of decimal significant figures of a number.
 * This function will fail if the given number has more than 16 significant figures or
 * the value of the number is greater than 10^11
 *
 * @param number
 */
function daffPrecision(number: number): number {
  let p = 10000;
  if(number === undefined || number === null) {
    return p;
  }
  while (Math.round(number * p) / p !== number) {
    p *= 10;
  }
  return p;
}

/**
 * A function to add long numbers accurately with conversions and integer math.
 * This function only guarantees correct answers when the numbers given and the result are less than
 * 16 significant figures and less than 10^11
 *
 * @param numbers
 */
export function daffAdd(...numbers: number[]): number {
  if(numbers.length < 2) {
    throw new Error('Provide at least 2 numbers for daffAdd.');
  }
  const precision = Math.max(...numbers.map(daffPrecision));
  return numbers.reduce((acc, number) => acc + Math.round(number*precision), 0) / precision;
}

/**
 * A function to subtract long numbers accurately with conversions and integer math.
 * This function only guarantees correct answers when the numbers given and the result are each less than
 * 16 significant figures and less than 10^11
 *
 * @param numbers
 */
export function daffSubtract(...numbers: number[]): number {
  if(numbers.length < 2) {
    throw new Error('Provide at least 2 numbers for daffSubtract.');
  }
  const precision = Math.max(...numbers.map(daffPrecision));
  return numbers.slice(1).reduce(
    (acc, number) => acc - Math.round(number*precision),
    Math.round(numbers[0]*precision),
  ) / precision;
}

/**
 * A function to multiply long numbers accurately with conversions and integer math.
 * This function only guarantees correct answers when the numbers given and the result are each less than 16 significant figures
 * and less than 10^11
 *
 * @param numbers
 */
export function daffMultiply(...numbers: number[]): number {
  if(numbers.length < 2) {
    throw new Error('Provide at least 2 numbers for daffMultiply.');
  }
  const precision = Math.max(...numbers.map(daffPrecision));
  return numbers.reduce(
    (acc, number) => acc * Math.round(number*precision),
    1,
  ) / Math.pow(precision, numbers.length);
}

/**
 * A function to divide long numbers accurately with conversions and integer math.
 * This function only guarantees correct answers when the numbers given and the result are each less than 16 significant figures
 * and less than 10^11
 *
 * Returns NaN when attempting to use NaN as an input.
 * Returns NaN when attempting to divide by 0 or null.
 *
 * @param numbers
 */
export function daffDivide(...numbers: number[]): number {
  if(numbers.length < 2) {
    throw new Error('Provide at least 2 numbers for daffDivide.');
  }
  // TODO(griest024): use better condition after IE support is dropped
  const illegalOperation = numbers.filter(isNaN).length > 0
    || numbers.slice(1).filter(n => n === 0 || n === null).length > 0;
  if (illegalOperation) {
    return NaN;
  }
  const precision = Math.max(...numbers.map(daffPrecision));
  return numbers.slice(1).reduce(
    (acc, number) => acc / Math.round(number*precision),
    Math.round(numbers[0]*precision),
  ) * Math.pow(precision, numbers.length - 2);
}
