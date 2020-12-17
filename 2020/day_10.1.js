const ALL_RATINGS = require('./day_10.data');

// 2112 (64 * 33)
// 2210 (65 * 34)

const SAMPLE_SMALL = [
	16,
  10,
  15,
  5,
  1,
  11,
  7,
  19,
  6,
  12,
  4,
];

const SAMPLE_MEDIUM = [
  28,
  33,
  18,
  42,
  31,
  14,
  46,
  20,
  48,
  47,
  24,
  23,
  49,
  45,
  19,
  38,
  39,
  11,
  1,
  32,
  25,
  35,
  8,
  17,
  7,
  9,
  4,
  2,
  34,
  10,
  3
];


function getRatings() {
  return ALL_RATINGS;
  //return SAMPLE_MEDIUM;
  //return SAMPLE_SMALL;
}


function main() {
  const ratings = getRatings();

  // Will I ever go down, then back up?
  // I don't think so.
  // What if there are dupes?
  //  NO DUPES
  // Will try sorting first, then stack up

  // sort low-to-high
  ratings.sort((a, b) => (a-b));
  console.log(ratings);

  // Initialize gap counts, taking into consideration
  // the first wall-to-adapter gap of 1,
  // and the final adapter-to-device gap of 3.
  const gaps = {
    1: 1,
    3: 1,
  };
  let a = 0;
  let b = 1;
  let diff = 0;
  while (b < ratings.length) {
    diff = ratings[b] - ratings[a];
    if (!gaps.hasOwnProperty(diff)) {
      gaps[diff] = 0;
    }
    gaps[diff]++;
    a++;
    b++;
  }

  console.log('Gap analysis', gaps);
  console.log(`Product is ${gaps[1] * gaps[3]} (${gaps[1]} * ${gaps[3]})`);
}


main();
