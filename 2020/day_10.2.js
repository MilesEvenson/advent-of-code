const ALL_RATINGS = require('./day_10.data');


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
  //return ALL_RATINGS;
  //return SAMPLE_MEDIUM;
  return SAMPLE_SMALL;
}


function main() {
  const ratings = getRatings();
  ratings.sort((a, b) => (a-b));
  ratings.unshift(0);

  const paths = [0];
  let newPaths = [];

  let p = 0;
  let r = 1;
  let temp = [];
  while (r < ratings.length) {
    p = 0;
    newPaths = [];
    while (p < paths.length) {
      if (ratings[r] <= paths[p][0] + 3) {
        paths[p].unshift(ratings[r]);
      }
      p++;
    }
    r++;
  }


  // Plan: ???

  console.log(ratings.join(', '));
  console.log(paths.map(p => p.reverse().join(', ')));

}


main();
