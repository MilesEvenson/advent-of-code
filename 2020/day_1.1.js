const nums = require('./day_1.1.data');

let found = false;
let outer = 0;
let inner = 0;


while (!found && outer < nums.length) {
  inner = outer + 1;
  while (inner < nums.length) {
    if (nums[outer] + nums[inner] === 2020) {
      console.log(`${nums[outer]} + ${nums[inner]} = 2020`);
      found = true;
      break;
    }
    inner++;
  }
  outer++;
}


