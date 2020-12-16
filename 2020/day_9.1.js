const FULL_DATA = require('./day_9.data');

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

  const WINDOW = 25;
  //const WINDOW = 5;
  const subset = [];

  let n = 0;
  while (n < WINDOW) {
    subset.push(nums[n]);
    n++;
  }
  subset.sort();

  let oldIndex = 0;
  let oldNum = 0;
  let left = 0;
  let right = 0;

  while (n < nums.length) {
    left = 0;
    right = WINDOW - 1;
    // check n against subset
    while (left < right) {
      //console.log(subset, nums[n], n, left, right);
      if (subset[left] + subset[right] === nums[n]) {
        //console.log(`  found a sum: subset[${left}](${subset[left]}) + subset[${right}](${subset[right]}) === ${nums[n]}`);
        break;
      } else if (subset[left] < (nums[n] - subset[right])) {
        //console.log('  >>> moving in from the left');
        left++;
      } else if ((nums[n] - subset[left]) < subset[right]) {
        //console.log('  <<< moving in from the right');
        right--;
      } else {
        console.warn(`  wat do: [ left, right ] == [ ${left}, ${right} ]`);
      }
    }
    //console.log('  out of left/right loop');
    if (right <= left) {
      //console.log('Failed to find two nums that sum');
      break;
    }
    n++;
    oldIndex = subset.findIndex(val => val === nums[n-WINDOW-1]);
    //console.log(`oldnum was ${subset[oldIndex]}`);
    subset[oldIndex] = nums[n-1];
    // It's simpler here to sort than to medium-complex one-pass shifting logic.
    subset.sort((a, b) => {
      if (a < b) {
        return -1;
      } else if (b < a) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  if (n < nums.length) {
    console.log(`Found target number (${nums[n]}) at index (${n})`);
  } else {
    console.error('Failed to find the target number');
  }
}


main();
