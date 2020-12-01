const nums = require('./day_1.1.data');

// First attempt: brute force
// Time complexity:   O(N^2)
// Space complexity:  O(N)
//
let found = false;
let outer = 0;
let inner = 0;
while (!found && outer < nums.length) {
  inner = outer + 1;
  while (inner < nums.length) {
    if (nums[outer] + nums[inner] === 2020) {
      console.log(`Brute force method successful.`);
      console.log(`${nums[outer]} + ${nums[inner]} = 2020`);
      found = true;
      break;
    }
    inner++;
  }
  outer++;
}


// Second attempt: remember what we've seen
// Time complexity:   O(N)
// Space complexity:  O(N)
const lookup = nums.reduce(
  (dict, n) => {
    dict[n] = 1;
    return dict;
  },
  {}
);

let i = 0;
let num = 0;
let partner = 0;
while (i < nums.length) {
  num = nums[i];
  partner = 2020 - num;
  if (lookup[partner]) {
    console.log('Lookup method successful.');
    console.log(`${num} + ${partner} = 2020`);
    console.log(`The product is: ${(num * partner)}`);
    break;
  }
  i++;
}



