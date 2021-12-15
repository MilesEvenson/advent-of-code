import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  
//
// Complexity Analysis:
//
//  Time Complexity:
//
//  Space complexity:
//
//
// Total time,    ????  minutes
//  Planning       ??
//  Programming    ??
//  Debugging      ??
//
//
//
//


const SAMPLE_GRID = [
  '1163751742',
  '1381373672',
  '2136511328',
  '3694931569',
  '7463417111',
  '1319128137',
  '1359912421',
  '3125421639',
  '1293138521',
  '2311944581',
];

const SAMPLE_TWISTER = [
  '1169751742',
  '1381373672',
  '2796511328',
  '1692931569',
  '1131417111',
  '1319128137',
  '1359912421',
  '3125421639',
  '1293138521',
  '2311944581',
];


function getGrid(): string[] {
  let rawLines = SAMPLE_GRID;
  if (process.env.SOURCE === 'FULL') {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data', 'day_15.input.txt'));
    rawLines = buffInput.toString()
      .trim()
      .split('\n');
  }

  return rawLines;
}


function parseGrid(rawLines: string[]): number[][] {
  return rawLines.map(line => {
    const row: number[] = [];
    for (let c = 0; c < line.length; c++) {
      row.push(parseInt(line[c], 10));
    }
    return row;
  });
}


function day15_1(): void {
  console.log('Welcome to Day 15.1. Going full travelling salesman?');

  // First Idea:
  //  Greedy Algorithm
  //  For any given cell, move to the lowest neighbor.
  //  Not guaranteed to give a global minimum, but it's easy to write.
  //  How to direct the path from NW to SE?
  //  Can I work incrementally, outside-in?
  //  "What is safest path between 2 cells?"
  //    - pick one move for each node
  //    - run again
  //
  //  Put a weight on moving away?
  //    - 0pt for matching 1 direction
  //    - 2pt for matching 0 direction
  //
  //
  //  Reviewing the sample grid,
  //  there is a branch in the NW corner [3,2] where
  //  the path moves 6 -> 5 instead of 6 -> 4.
  //  Pure Greedy Algo won't work here.
  //  Moving on
  //
  //
  // How can I refine an existing path, cell-by-cell?
  // Maybe I can brute force it?
  // No
  // Full input is 100x100.
  // I don't have memory for 2^100 paths.
  // Back to the refining idea.
  //
  // How would that work?
  // Start with stairstep path from NW to SE
  //  [0,0], [0,1], [1,1], [1,2], [2,2], ...
  // Then iterate over the cells in the path,
  // evaluating neighbors of each/
  // No, this is just the Greedy Algo again.
  //
  //
  // Taking a step back
  // What are mistakes to avoid?
  //  1. local minima, only moving to the safest neighbor
  //  2. handling ties
  //
  // How much lookahead can I get away with?
  // Maybe the wrong question
  //
  //
  // What ub Divide and Conquer?
  // Given two points that define a rectangle,
  // subdivide that into 4 smaller rectangles?
  // What is the goal?
  // What is the base case?
  //  For any given rectangle, find the safest path "through" it.
  // What does "through" mean here?
  //
  // Instead of thinking ub paths through a rectangle,
  // what if I calculated the total/average risk for it?
  // Recursion down to base case (4x4?),
  // Then...?
  // What do I do with the bigger aggregate rectangles?
  // I don't think I care what the big rectangle averages are?
  //
  //
  // Hmmm
  // 
  // 


  const grid = parseGrid(getGrid());

  const pathLength = 0;
  const totalRiskLevel = 0

  console.log(`Traversed (${pathLength}) cells with a total risk level of (${totalRiskLevel}).`);
}


day15_1();

