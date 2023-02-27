export const numberToFraction = function (number) {
  let numerand = 0;
  let wholeNumber = number >= 1 ? Math.trunc(number) : '';
  let denominator = 10000;
  let decimals = Math.trunc((1 - (Math.trunc(number + 1) - number)) * 10000);

  for (let i = 2; i <= decimals; i++) {
    if (decimals % i === 0 && 10000 % i === 0) {
      numerand = decimals / i;
      denominator = 10000 / i;
    }
  }

  if (numerand > 0) return `${wholeNumber} ${numerand}/${denominator}`;
  return `${wholeNumber}`;
};

export const findIndex = function (arr, element) {
  // console.log(element);
  if (!arr[0]) return;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].title == element.title) {
      console.log(arr[i]);

      return i;
    }
  }
  return -1;
};
