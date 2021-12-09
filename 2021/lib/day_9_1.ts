import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  Traverse the grid, checking each cell
//  to see if it is a local minimum.
//  If it is, add it to the list of low points.
//  Finally, sum the list of low points.
//
// Complexity Analysis:
//  C: total number of cells in the grid
//
//  Time Complexity:
//    O(C)
//    Proces each cell in the grid once.
//
//  Space complexity:
//    O(C)
//    Store the entire grid in memory.
//
//
// Total time:  ~15 minutes
//



const SAMPLE_LINES = [
  '2199943210',
  '3987894921',
  '9856789892',
  '8767896789',
  '9899965678',
];


function getLines(): string[] {
  let rawLines = SAMPLE_LINES;
  if (process.env.SOURCE === 'FULL') {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data/day_9.input.txt'));
    rawLines = buffInput.toString()
      .trim()
      .split('\n');
  }

  return rawLines;
}


function day9_1(): void {
  console.log('Welcome to Day 9.1. Hitting all the low points.');

  const grid: number[][] = getLines().map(rawLine => {
    const nums = [];
    for (let c = 0; c < rawLine.length; c++) {
      nums.push(parseInt(rawLine[c], 10));
    }
    return nums;
  });


  function isLowpoint(row: number, col: number): boolean {
    if (0 < row && grid[row-1][col] <= grid[row][col]) {
      return false;
    } else if (col < grid[row].length - 1 && grid[row][col+1] <= grid[row][col]) {
      return false;
    } else if (row < grid.length - 1 && grid[row+1][col] <= grid[row][col]) {
      return false
    } else if (0 < col && grid[row][col-1] <= grid[row][col]) {
      return false
    }
    return true;
  }

  const lowPoints: number[] = [];

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (isLowpoint(r, c)) {
        console.log(`Found low point at (${r}, ${c}) with value (${grid[r][c]})`);
        lowPoints.push(grid[r][c]);
      }
    }
  }

  console.log(lowPoints.join(', '));

  const total = lowPoints.reduce((s, h) => (s + h + 1), 0);
  console.log(`Found total risk level (${total}) across (${lowPoints.length}) low points.`);
}


day9_1();

