const ALL_RATINGS = require('./day_10.data');


//      1   3   2   1   1    2   1   1   1   1   1
// (0), 1,  4,  5,  6,  7,  10, 11, 12, 15, 16, 19  (22)
const SAMPLE_SMALL = [ 16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4 ];

// (0),                     10, 11, 12, 15, 16, 19  (22)
// (0),                     10,     12, 15, 16, 19  (22)

// (0), 1,  4,  5,  6,  7,                          (22)
// (0), 1,  4,  5,      7,                          (22)
// (0), 1,  4,      6,  7,                          (22)
// (0), 1,  4,          7,                          (22)

// Two Paths
//  1   2   1   1   1
// (0)  2,  3,  5,  6   (10)

// Three Paths
//  1   2   2   1   1
// (0)  2,  4,  5,  6   (9)
// (0)  2,  4,      6   (9)
// (0)  2,      5,  6   (9)


// Four Paths
//      1   3   2   1   1
// (0), 1,  4,  5,  6,  7   (10)
// (0), 1,  4,  5,      7   (10)
// (0), 1,  4,      6,  7   (10)
// (0), 1,  4,          7   (10)


// Seven Paths
//      1   3   3   2   1   1
// (0), 1,  4,  5,  6,  7,  8   (11)
// (0), 1,  4,  5,  6,      8   (11)
// (0), 1,  4,  5,          8   (11)
// (0), 1,  4,  5,      7,  8   (11)
// (0), 1,  4,          7,  8   (11)
// (0), 1,  4,      6,  7,  8   (11)
// (0), 1,  4,      6,      8   (11)


// Ten Paths
//      1   3   3   3   2   1
// (0), 1,  4,  5,  6,  7,  8,  9   (12)
// (0), 1,  4,  5,  6,  7,      9   (12)
// (0), 1,  4,  5,      7,  8,  9   (12)
// (0), 1,  4,  5,      7,      9   (12)
// (0), 1,  4,  5,          8,  9   (12)
// (0), 1,  4,      6,      8,  9   (12)
// (0), 1,  4,      6,  7,      9   (12)
// (0), 1,  4,      6,          9   (12)
// (0), 1,  4,          7,  8,  9   (12)
// (0), 1,  4,          7,      9   (12)


//     1, 3,  2,  2,  2,  1,   1
// (0) 1, 4,  5,  6,  7,  9,  10  (13)
//
// (0) 1, 4,  5,  6,  7,  9,  10
// (0) 1, 4,  5,  6,  7,      10
// (0) 1, 4,  5,  6,      9,  10
// (0) 1, 4,  5,      7,  9,  10
// (0) 1, 4,  5,      7,      10
// (0) 1, 4,      6,  7,  9,  10
// (0) 1, 4,      6,  7,      10
// (0) 1, 4,      6,      9,  10
// (0) 1, 4,          7,  9,  10
// (0) 1, 4,          7,      10


//     1  2   1   1   2   1    1    1
// (0) 1, 4,  5,  6,  9, 10,  11,  14  (17)
//
// (0) 1, 4,  5,  6,  9, 10,  11,  14  (17)
// (0) 1, 4,  5,  6,  9,      11,  14  (17)
// (0) 1, 4,      6,  9, 10,  11,  14  (17)
// (0) 1, 4,      6,  9,      11,  14  (17)


//  2  2   1   1   2   1    1
// (0) 2,  3,  5,  8, 10,  11  (14)
//
// (0) 2,  3,  5,  8, 10,  11  (14)
// (0) 2,  3,  5,  8,      11  (14)
// (0) 2,      5,  8, 10,  11  (14)
// (0) 2,      5,  8,      11  (14)
// (0)     3,  5,  8, 10,  11  (14)
// (0)     3,  5,  8,      11  (14)






//  3  3  2   1   1   3   3   2    1   1   1   3   2   1   1   2   1   1   1   3   3   2   1   1   1   1   1   3   3   2   1   1
// (0) 1, 2,  3,  4,  7,  8,  9,  10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31, 32, 33, 34, 35, 38, 39, 42, 45, 46, 47, 48, 49  (52)
const SAMPLE_MEDIUM = [ 28, 33, 18, 42, 31, 14, 46, 20, 48, 47, 24, 23, 49, 45, 19, 38, 39, 11, 1, 32, 25, 35, 8, 17, 7, 9, 4, 2, 34, 10, 3 ]; 


function getRatings() {
  let ratings = SAMPLE_SMALL.slice();
  if (process.env.SOURCE === 'SAMPLE_MED') {
    ratings = SAMPLE_MEDIUM.slice();
  } else if (process.env.SOURCE === 'FULL') {
    ratings = ALL_RATINGS.slice();
  }
  return ratings;
}


function main() {
  const ratings = getRatings();
  ratings.sort((a, b) => (a - b));
  //console.log(ratings.join(', '));
  ratings.unshift(0);

  // Plan A:
  //  - Build a tree representing adapter sequences.
  //  - Do an in-order traversal of the tree to build sequences.
  // Plan B:
  //  Building the tree, then traversing the tree takes too long.
  //  Maybe I can do it in a single pass?
  // Plan C:
  //  Sort, then sum up how many children each node has?
  // Plan D:
  //  Identify groups with multiple paths.
  //  Groups are separated by J nodes with 1 connection,
  //  where J is the number of connections of the last mutli-connected node.
  //  After *light* experimentation, I *think*
  //    (sumSequenceLinks - 1) => countSequencePaths
  //  WORKS
  //  Took ~200 minutes due to mistakes in reading and analysis :(



  // Array of arrays to make debugging easier.
  // Can also be a single integer holding the running product.
  const groups = [];
  let tempGroup = [];
  let idxTempTail = 0;
  let countLinks = 0;
  let countConsecutiveOnes = 0;
  for (let r = 0; r < ratings.length; r++) {
    countLinks = 0;
    if (r < ratings.length - 1 && ratings[r+1] <= ratings[r] + 3) {
      countLinks++;
    }
    if (r < ratings.length - 2 && ratings[r+2] <= ratings[r] + 3) {
      countLinks++;
    }
    if (r < ratings.length - 3 && ratings[r+3] <= ratings[r] + 3) {
      countLinks++;
    }

    console.log(`Rating (${ratings[r]}) at (${r}) has (${countLinks}) links.`);

    tempGroup.push({
      links: countLinks,
      rating: ratings[r],
    });
    
    if (countLinks === 1) {
      countConsecutiveOnes++;
      if (countConsecutiveOnes === tempGroup[idxTempTail].links) {
        groups.push(tempGroup);
        tempGroup = [];
        countConsecutiveOnes = 0;
        idxTempTail = 0;
      }
    } else if (1 < countLinks) {
      idxTempTail++;
    } else {
      console.error(`Adapter (${ratings[r]}) at (${r}) has ZERO links!`);
    }

  }

  const sums = groups.map(g => {
    const countSequencePaths = g.reduce(
      (s, n) => {
        if (n.links === 1) {
          return s;
        }
        return s + n.links;
      },
      0
    );

    console.log(`Sequence (${g.map(g => g.links).join(', ')}) has raw count => (${countSequencePaths})`);

    if (countSequencePaths <= 2) {
      return countSequencePaths;
    }
    return countSequencePaths - 1;
  });

  console.dir(groups, { depth: null, maxArrayLength: null });
  console.log(sums.join(', '));

  const totalBranches = sums
    .filter(s => (0 < s))
    .reduce((p, c) => (p * c), 1);

  console.log(`Got (${totalBranches}) paths for (${ratings.length}) adapters.`);

}


main();

