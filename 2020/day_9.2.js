const FULL_DATA = require('./day_9.data');

// 2186361

const SAMPLE = [
  35,
  20,
  15,
  25,
  47,
  40,
  62,
  55,
  65,
  95,
  102,
  117,
  150,
  182,
  127,
  219,
  299,
  277,
  309,
  576
];


function getNums() {
  return FULL_DATA;
  //return SAMPLE;
}



function main() {
  const nums = getNums();

  const TARGET = 18272118;
  //const TARGET = 127;

  // Assume all numbers are positive
  let left = 0;
  let right = 0;
  let sum = nums[0];

  while (sum !== TARGET && left <= right && right < nums.length - 1) {
    if (sum < TARGET) {
      right++;
      sum += nums[right];
    } else if (TARGET < sum) {
      sum -= nums[left];
      left++;
    }
  }

  console.log(`out of loop with ${left} - ${right}`);
  console.log(nums.slice(left, right+1));

  // Maybe this should be 2 heaps?
  // That seems inefficient.
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  let i = left;
  while (i <= right) {
    if (nums[i] < min) {
      min = nums[i];
    } else if (max < nums[i]) {
      max = nums[i];
    }
    i++;
  }

  console.log(`Min: ${min}, Max: ${max}, Sum: ${min + max}`);
}


main();
