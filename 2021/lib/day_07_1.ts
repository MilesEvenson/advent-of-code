import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  Sort list of initial positions.
//  Determine median position.
//  Sum costs to move to the median position.
//  No idea if this is a robust solution.
//  I do not have the math knowledge to explore this approach.
//
//  UPDATE FROM THE AFTERNOON ON DEC 7
//  I really like this explanation of why the median yields the smallest sum:
//    https://math.stackexchange.com/a/113336
//
//
// Complexity Analysis:
//  N: number of crab subs
//
//  Time Complexity:
//    O(Nlog2N)
//    Sort the array of initial positions.
//
//  Space complexity:
//    O(N)
//    Store initial positions in an array.
//
//
// Total time:  ~115 minutes
//  Roughly 45 minutes of amateurish experimentation
//  Roughly 10 minutes to write solution
//  Roughly 20 minutes spent verifying my work because
//    I failed at copy/pasting my output into the website
//



const SAMPLE_POSITIONS = '16,1,2,0,4,2,7,1,2,14';


function getPositions(): number[] {
  let rawLine = SAMPLE_POSITIONS;
  if (process.env.SOURCE === 'FULL') {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data/day_7.input.txt'));
    rawLine = buffInput.toString().trim();
  }

  return rawLine
    .trim()
    .split(',')
    .map(strNum => parseInt(strNum, 10));
}


function mean(positions: number[]): number {
  const sum = positions.reduce((sum, i) => (sum + i ), 0);
  return sum / positions.length;
}


function median(positions: number[]): number {
  positions.sort((a, b) => (a - b));
  const midpoint = Math.floor(positions.length / 2);
  return positions[midpoint];
}


function mode(positions: number[]): number {
  let maxKey = '';
  let maxCount = 0;
  const counts: Record<string, number> = {};
  for (const x of positions) {
    if (!counts.hasOwnProperty(`${x}`)) {
      counts[`${x}`] = 0;
    }
    counts[`${x}`]++;
    if (maxCount < counts[`${x}`]) {
      maxCount = counts[`${x}`];
      maxKey = `${x}`;
    }
  }
  return parseInt(maxKey, 10);
}


function histogram(positions: number[]): string {
  let max = -1;
  const counts = positions.reduce(
    (dict, x) => {
      if (max < x) {
        max = x;
      }
      if (!dict.hasOwnProperty(`${x}`)) {
        dict[`${x}`] = 0;
      }
      dict[`${x}`]++;
      return dict;
    },
    {} as Record<string, number>
  );
  let bar: string[] = [];
  const stacks: string[] = [];
  for (let i = 0; i <= max; i++) {
    bar = [];
    if (counts.hasOwnProperty(`${i}`)) {
      for (let k = 0; k < counts[`${i}`]; k++) {
        bar.push('*');
      }
      stacks.push(bar.join(''));
    } else {
      stacks.push('');
    }
  }
  return stacks.join('\n');
}


function bruteForce(positions: number[]): number[] {
  const max = positions.reduce(
    (loopMax, i) => ( (loopMax < i) ? i : loopMax ),
    0
  );

  let tempSum = 0;
  const costTotals = [];
  for (let target = 0; target <= max; target++) {
    tempSum = 0;
    for (let p = 0; p < positions.length; p++) {
      tempSum += Math.abs(positions[p] - target);
    }
    costTotals.push(tempSum);
  }
  return costTotals;
}


function exploration(): void {
  const scenarios: Record<string, number[]> = {
    sample: [ 0, 1, 1, 2, 2, 2, 4, 7, 14, 16 ],
    dumbbell: [ 0, 0, 0, 0, 8, 8, 8, 8 ],
    middle: [ 0, 3, 5, 5, 6, 6, 6, 6, 7, 7, 9, 11, 14 ],
    ramp: [ 0, 3, 5, 7, 7, 10, 10, 10, 10],
    steepRamp: [ 0, 3, 5, 8, 8, 40, 40, 40, 40],
  };

  let floatMean = 0.0;
  let intMean = 0;
  for (const key in scenarios) {
    floatMean = mean(scenarios[key]);
    intMean = Math.floor(floatMean);
    console.log(`Scenario: (${key})`);
    console.log(scenarios[key].join(', '));
    console.log(`Mean: (${floatMean}) / (${intMean})`);
    console.log(`Median: (${median(scenarios[key])})`);
    console.log(`Mode: (${mode(scenarios[key])})`);
    console.log(`Cost totals: ${bruteForce(scenarios[key])}`);
    console.log(histogram(scenarios[key]));
  }
}


function day7_1(): void {
  console.log('Welcome to Day 7.1. Crabs assemble!');

  // Load positions from input
  // Sort numbers
  // Determine the median value
  // Sum distances to median value
  // Wish I had a mathy explanation for this ¯\_(ツ)_/¯

  const crabNavy = getPositions();
  crabNavy.sort((a, b) => (a -b));
  const midpoint = Math.floor(crabNavy.length / 2);
  const targetPosition = crabNavy[midpoint];
  const totalFuel = crabNavy.reduce(
    (sum, x) => (sum + Math.abs(x - targetPosition)),
    0
  );

  const costsBruteForce = bruteForce(crabNavy);
  let targetBruteForce = 0;
  let costBruteForce = Number.MAX_SAFE_INTEGER
  for (let p = 0; p < costsBruteForce.length; p++) {
    if (costsBruteForce[p] < costBruteForce) {
      costBruteForce = costsBruteForce[p];
      targetBruteForce = p;
    }
  }
  const floatMean = mean(crabNavy);
  const intMean = Math.floor(floatMean);
  console.log(`Mean: (${floatMean}) / (${intMean})`);
  console.log(`Median: (${median(crabNavy)})`);
  console.log(`Mode: (${mode(crabNavy)})`);
  console.log(`Brute force target: (${targetBruteForce})`);
  console.log(`Brute force total cost: (${costBruteForce})`);

  console.log(`Spent (${totalFuel}) fuel to move (${crabNavy.length}) crabs to position (${targetPosition}).`);
}


//exploration();
day7_1();

