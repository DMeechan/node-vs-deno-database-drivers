// @ts-nocheck - I don't have time to resolve these warnings
// Source: https://snippets.bentasker.co.uk/page-1907020841-Calculating-Mean,-Median,-Mode,-Range-and-Percentiles-with-Javascript-Javascript.html

/** Calculate the mean value of an array of values
 *
 * @arg array
 * @return mixed
 */
export function calcAverage(arr: number[]): number | false {
  const array = arr.slice();
  if (array.length) {
    const sum = sumArr(array);
    const avg = sum / array.length;
    return avg;
  }
  return false;
}

/** Extract the maximum in an array of values
 *
 * @arg arr - array
 * @return float
 */
export function calcMax(arr: number[]) {
  return Math.max(...arr);
}

/** Calculate the Median of an array of values
 */
export function calcMedian(arr: number[]) {
  const array = arr.slice();
  const hf = Math.floor(array.length / 2);
  arr = sortArr(array);
  if (array.length % 2) {
    return array[hf];
  } else {
    return (parseFloat(array[hf - 1]) + parseFloat(array[hf])) / 2.0;
  }
}

/** Extract the maximum in an array of values
 *
 * @arg arr - array
 * @return float
 */
export function calcMin(arr: number[]): number {
  return Math.min(...arr);
}

/** Calculate the Modal value
 *
 * @arg arr - array
 * @return float
 */
export function calcMode(arr: number[]) {
  const array = arr.slice();
  const t = array.sort(function (a, b) {
    array.filter(function (val) {
      val === a;
    }).length - array.filter(function (val) {
      val === b;
    }).length;
  });
  return t.pop();
}

/** Calculate the 'q' quartile of an array of values
 *
 * @arg arr - array of values
 * @arg quantile - percentile to calculate (e.g. 95)
 */
export function calcQuartile(arr: number[], quantile: number) {
  const array = arr.slice();
  // Turn q into a decimal (e.g. 95 becomes 0.95)
  quantile = quantile / 100;

  // Sort the array into ascending order
  const data = sortArr(array);

  // Work out the position in the array of the percentile point
  const p = ((data.length) - 1) * quantile;
  const b = Math.floor(p);

  // Work out what we rounded off (if anything)
  const remainder = p - b;

  // See whether that data exists directly
  if (data[b + 1] !== undefined) {
    return parseFloat(data[b]) +
      remainder * (parseFloat(data[b + 1]) - parseFloat(data[b]));
  } else {
    return parseFloat(data[b]);
  }
}

/** Calculate the range for a set of values
 *
 * @arg arr - array
 * @return float
 */
export function calcRange(arr: number[]) {
  const mx = calcMax(arr);
  const mn = calcMin(arr);
  return mx - mn;
}

/** Sum all values in an array
 */
export function sumArr(arr: number[]) {
  const array = arr.slice();
  return array.reduce(function (a, b) {
    return parseFloat(a) + parseFloat(b);
  });
}

/** Sort values into ascending order
 */
export function sortArr(arr: number[]) {
  const array = arr.slice();
  array.sort(function (a, b) {
    return parseFloat(a) - parseFloat(b);
  });
  return array;
}
