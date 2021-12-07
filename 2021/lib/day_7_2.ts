import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  Brute force :(
//
// Complexity Analysis:
//  N: number of crab subs
//  X: max position
//
//  Time Complexity:
//    O(X^2)
//    For each position, calculate the total cost for 
//    all crabs to move to that position
//
//  Space complexity:
//    O(X)
//    Create an array of move costs for positions 0 - X (inclusive)
//
//
// Total time:  ~10 minutes
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


function getAllCosts(positions: number[], max: number): number[] {
  let distance = 0;
  let tempSum = 0;
  const costTotals = [];
  for (let target = 0; target <= max; target++) {
    tempSum = 0;
    for (let p = 0; p < positions.length; p++) {
      distance = Math.abs(positions[p] - target);
      tempSum += distance * (distance + 1) / 2;
    }
    costTotals.push(tempSum);
  }
  return costTotals;
}


function day7_2(): void {
  console.log('Welcome to Day 7.2. Crabs assemble, efficiently!');

  const crabNavy = getPositions();

  const maxPosition = crabNavy.reduce(
    (m, p) => ((m < p) ? p : m),
    0
  );

  const costsBruteForce = getAllCosts(crabNavy, maxPosition);
  let targetBruteForce = 0;
  let costBruteForce = Number.MAX_SAFE_INTEGER
  for (let p = 0; p < costsBruteForce.length; p++) {
    if (costsBruteForce[p] < costBruteForce) {
      costBruteForce = costsBruteForce[p];
      targetBruteForce = p;
    }
  }

  console.log(`Brute force target: (${targetBruteForce})`);
  console.log(`Brute force total cost: (${costBruteForce})`);

}


day7_2();

