const nums = require('./day_1.data');


// Thoughts

// I can build a 2-dimensional array of ever paired sum.
// Then I can check each paired sum against each number in the list.
// This is gross, but would work.
// Can I be more efficient?

// Build a hash of { pairsum: (left, right), ... }
// Then walk nums looking for the pairsum



// First Attempt: brute force
// Time complexity:   O(N^2)
// Space complexity:  O(N^2)


const lookup = {};

let outer = 0;
let inner = 0;
let sum = 0;

while (outer < nums.length) {
  inner = outer + 1;
  while (inner < nums.length) {
    sum = nums[outer] + nums[inner];
    lookup[sum] = [
      nums[outer],
      nums[inner]
    ];
    inner++;
  }
  outer++;
}

let i = 0;
let target = 0;
while (i < nums.length) {
  target = 2020 - nums[i];
  if (lookup[target]) {
    console.log(`${nums[i]} + ${lookup[target][0]} + ${lookup[target][1]} = 2020`);
    console.log(`Product: ${(nums[i] * lookup[target][0] * lookup[target][1])}`);
    break;
  }
  i++;
}

