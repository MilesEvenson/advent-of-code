import * as fs from 'fs';
import path from 'path';


//
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
// I'll code up an exploratory function to calculate
// the average safety for +2/-2 around each cell.
// Using a radius of 2 wasn't helpful. Most cells average to 4.
//
// Using a radius of 1 was a little more helpful, but didn't
// provide a clear path. There are many blocks of 4 and 5 averages.
//
//
// My gut wants me to re-consider Divide and Conquer.
//  1. How do I select the initial endpoints?
//  2. How determine the path between? Brute force at the base case?
//  2. How do I adjust the endpoints?
//
// What is base case? 4x4?
// I'm fine with hard-coding that for this problem.
// Probably choose max(2, lowest divisor) if input varies.
// Prefer 3x3 or 4x4 or 5x5 to 2x2.
//
// For given [row, col]
//  - if base
//    - return brute force path
//  - find diagonal mid,
//  - get NW path
//  - get SE path
//  - return NW + SE path
//
// Still not sure how to adjust endpoints.
// Finding optimal paths for [0,0] - [4,4]
// and [4, 4] - [9,9] does not get me close
// to the global minimum path.
//
//
// Fine.
// What does a modified Greedy Algo look like?
//  1. Establish base path with Greedy Algorithm.
//  2. Working backwards step-by-step,
//      brute force alternate paths until,
//        - incomplete alt path has higher risk than base path
//        - complete alt path is safer than base path
//  3. If alt path is better,
//      continue exploring alt paths from the branch point.
//
// Ignoring lookahead for now to avoid additional complexity.
//
// Seems fine at a high level.
// What does implementation look like?
//  - basePath <= Greedy Algo
//  - stepping backwards through basePath,
//    - recursive brute force alternates.
//    - if altPath < basePath
//      - update basePath for record keeping
//    - continue stepping backwards through path.
//
// My Greedy Algo:
//  for a given cell, move to safest unvisited neighbor
//    if tie, pick South-er, or East-er branch.
//
// This is too slow!
// On the 10x10 test grid, the brute force backtracking
// is waaaaay too slow (15min to backtrack 44 steps).
//
//
// Third Idea:
//  Incrementally calculate each cell's distance to the entrance,
//  then find a good path using those values.
//
//  How would this work?
//  Track costs in dict
//  Start at entry (0, 0)
//  get neighbors
//  set costs for each entrance's 2 immediate neighbors
//  for each immediate neighbor, push East and South neighbors onto queue
//  loop on queue
//    get cell of front of queue
//    if already checked
//      continue
//    calc distance using West and North neighbors
//    set distance
//    push East and South neighbors onto queue
//
//  Possible issues
//    - missing cheap detours
//        116   017
//        124   137
//        81    94
//        12    76
//      Here it's cheaper for the bottom 2 to loop around the 8
//      than to go direct through the 8 toward the entry.
//      How to handle this when calculating distances?
//      Maybe ignore it.
//      Just do a second O(N) pass over the grid to handle updates.
//
//
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
  '0163751742',
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

const SAMPLE_SMALL = [
  '016',
  '138',
  '213',
];

const SAMPLE_TWISTER = [
  '0169751742',
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

const SAMPLE_DETOUR = [
  '0168',
  '1242',
  '8174',
  '1221',
];

// 9 colors to make it easy to map value -> color
const SPECTRUM = [
  // black
  //'\x1b[2m\x1b[30m',
  //'\x1b[1m\x1b[30m',
  '\x1b[30m',

  // red
  //'\x1b[2m\x1b[31m',
  '\x1b[1m\x1b[31m',
  '\x1b[31m',

  // yellow
  //'\x1b[2m\x1b[33m',
  '\x1b[33m',
  //'\x1b[1m\x1b[33m',

  // green
  //'\x1b[2m\x1b[32m',
  '\x1b[32m',
  //'\x1b[1m\x1b[32m',

  // blue
  //'\x1b[2m\x1b[34m',
  '\x1b[34m',
  //'\x1b[1m\x1b[34m',

  // cyan
  //'\x1b[2m\x1b[36m',
  '\x1b[36m',
  //'\x1b[1m\x1b[36m',

  // white
  //'\x1b[2m\x1b[37m',
  '\x1b[37m',
  '\x1b[1m\x1b[37m',

  // bg white / fg black
  '\x1b[47m\x1b[30m',

];


const C_RESET = '\x1b[0m';


interface Step {
  row: number;
  col: number;
  risk: number;
  pathRisk: number;
}


interface Coord {
  row: number;
  col: number;
}


function getGrid(): string[] {
  let rawLines = SAMPLE_GRID;
  if (process.env.SOURCE === 'SMALL') {
    rawLines = SAMPLE_SMALL;
  } else if (process.env.SOURCE === 'TWISTER') {
    rawLines = SAMPLE_TWISTER;
  } else if (process.env.SOURCE === 'DETOUR') {
    rawLines = SAMPLE_DETOUR;
  } else if (process.env.SOURCE === 'FULL') {
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


function printHeatmapFromDict(
  dict: Record<string, number>,
  grid: number[][],
  maxValue: number,
  rowMax: number,
  colMax: number
): void {
  console.log(`Printing heatmap from dict. Got maxValue (${maxValue})`);
  let slug: string;
  let rowVals: string[] = [];
  let colorIndex = 0;
  let color = '';
  let pad = '';
  for (let r = 0; r <= rowMax; r++) {
    rowVals = [];
    for (let c = 0; c <= colMax; c++) {
      slug = getSlug(r, c);
      pad = '  ';
      if (10 <= dict[slug]) {
        pad = ' ';
      }
      if (100 <= dict[slug]) {
        pad = '';
      }
      colorIndex = Math.floor(dict[slug] / ((maxValue+1) / SPECTRUM.length));
      //console.log(`Cell (${slug}) has value (${dict[slug]}) and colorIndex (${colorIndex})`);
      color = SPECTRUM[colorIndex];
      //rowVals.push(`${pad}${color}${Math.round(dict[slug])}${C_RESET} `);
      rowVals.push(`${color}${grid[r][c]}${C_RESET}`);
    }
    console.log(rowVals.join(''));
  }
}

function printHeatmapFromGrid(grid: number[][]): void {
  let rowVals: string[] = [];
  let colorIndex = 0;
  let color = '';
  for (let r = 0; r < grid.length; r++) {
    rowVals = [];
    for (let c = 0; c < grid[r].length; c++) {
      colorIndex = Math.max(0, Math.round(grid[r][c]) - 1);
      color = SPECTRUM[colorIndex];
      rowVals.push(`${color}${Math.round(grid[r][c])}${C_RESET}`);
    }
    console.log(rowVals.join(''));
  }
}


function printPath(
  steps: Step[],
  rowMax: number,
  colMax: number
): void {
  let line: string[];
  let cell: string;
  for (let r = 0; r <= rowMax; r++) {
    line = [];
    for (let c = 0; c <= colMax; c++) {
      cell = ' ';
      steps.forEach((s, idx) => {
        if (s.row == r && s.col == c) {
          const colorIndex = Math.floor(idx / SPECTRUM.length) % SPECTRUM.length;
          const shortStep = idx % 10;
          cell = `${SPECTRUM[colorIndex]}${shortStep}${C_RESET}`;
        }
      });
      line.push(cell);
    }
    console.log(line.join(''));
  }
}


function getSlug(row: number, col: number): string {
  return `${row}-${col}`;
}

function getCrSlug(pair: Coord): string {
  return `${pair.row}-${pair.col}`;
}


function calculateRisks(grid: number[][]): Record<string, number> {
  const rowMax = grid.length - 1;
  const colMax = grid[0].length - 1;
  const risks: Record<string, number> = {
    [getSlug(rowMax, colMax)]: 1,
  };

  risks[getSlug(rowMax, colMax-1)] = grid[rowMax][colMax-1];
  risks[getSlug(rowMax-1, colMax)] = grid[rowMax-1][colMax];

  const queue = [
    { row: rowMax, col: colMax-2 },
    { row: rowMax-1, col: colMax-1 },
    { row: rowMax-2, col: colMax },
  ];
  let cell: Coord;
  let nMin = 10;
  let neighbors: Coord[] = [];
  let slugNorth: string;
  let slugEast: string;
  let slugSouth: string;
  let slugWest: string;

  while (0 < queue.length) {
    cell = queue.shift() as Coord;
    if (risks.hasOwnProperty(getCrSlug(cell))) {
      continue;
    }
    //console.log(`Processing cell (${getCrSlug(cell)} ${grid[cell.row][cell.col]})`);

    slugNorth = getCrSlug({ row: cell.row-1, col: cell.col });
    slugEast = getCrSlug({ row: cell.row, col: cell.col+1 });
    slugSouth = getCrSlug({ row: cell.row+1, col: cell.col });
    slugWest = getCrSlug({ row: cell.row, col: cell.col-1 });

    //console.log(slugNorth, slugEast, slugSouth, slugWest);
    //console.log(risks[slugNorth], risks[slugEast], risks[slugSouth], risks[slugWest]);

    nMin = Number.MAX_SAFE_INTEGER;
    neighbors = [];
    if (risks[slugNorth] < nMin) {
      nMin = risks[slugNorth];
    }
    if (risks[slugEast] < nMin) {
      nMin = risks[slugEast];
    }
    if (risks[slugSouth] < nMin) {
      nMin = risks[slugSouth];
    }
    if (risks[slugWest] < nMin) {
      nMin = risks[slugWest];
    }

    risks[getCrSlug(cell)] = nMin + grid[cell.row][cell.col];

    if (
      0 < cell.row
      && (
        !risks.hasOwnProperty(slugNorth)
        || risks[getCrSlug(cell)] < risks[slugNorth]
      )
    ) {
      queue.push({ row: cell.row-1, col: cell.col });
    }
    if (
      cell.col < grid[0].length-1
      && (
        !risks.hasOwnProperty(slugEast)
        || risks[getCrSlug(cell)] < risks[slugEast]
      )
    ) {
      queue.push({ row: cell.row, col: cell.col+1 });
    }
    if (
      cell.row < grid.length-1
      && (
        !risks.hasOwnProperty(slugSouth)
        || risks[getCrSlug(cell)] < risks[slugSouth]
      )
    ) {
      queue.push({ row: cell.row+1, col: cell.col });
    }
    if (
      0 < cell.col
      && (
        !risks.hasOwnProperty(slugWest)
        || risks[getCrSlug(cell)] < risks[slugWest]
      )
    ) {
      queue.push({ row: cell.row, col: cell.col-1 });
    }
  } // end - queue processing loop


  return risks;
}


function day15_1(): void {
  console.log('Welcome to Day 15.1. Going full travelling salesman?');

  function getOpenNeighborCoords(
    row: number,
    col: number,
    rowMax: number,
    colMax: number
  ): Coord[] {
    let coords: Coord[] = [];
    const slugHere = getSlug(row, col);
    const slugNorth = getSlug(row-1, col);
    const slugEast = getSlug(row, col+1);
    const slugSouth = getSlug(row+1, col);
    const slugWest = getSlug(row, col-1);
    const idxVisits = visitedCells.length - 1;

    if (0 < row && !visitedCells[idxVisits].hasOwnProperty(slugNorth)) {
      coords.push({ row: row-1, col: col });
    }
    if (col < colMax && !visitedCells[idxVisits].hasOwnProperty(slugEast)) {
      coords.push({ row: row, col: col+1 });
    }
    if (row < rowMax && !visitedCells[idxVisits].hasOwnProperty(slugSouth)) {
      coords.push({ row: row+1, col: col });
    }
    if (0 < col && !visitedCells[idxVisits].hasOwnProperty(slugWest)) {
      coords.push({ row: row, col: col-1 });
    }
    return coords;
  }


  const grid = parseGrid(getGrid());
  //grid.forEach(row => console.log(row.join('')));
  printHeatmapFromGrid(grid);
  const risks = calculateRisks(grid);
  const maxRisk = Object.values(risks).reduce((m, r) => ((m < r) ? r : m), 0);
  printHeatmapFromDict(risks, grid, maxRisk, grid.length-1, grid[0].length-1);
  const rowMax = grid.length - 1;
  const colMax = grid[0].length - 1;

  const visitedCells: Record<string, string>[] = [{'0-0': '0-0'}];
  let tip = 0;
  let allNeighbors: Coord[] = [];
  let openNeighbors: Coord[];
  let minRiskCoord: Coord;


  // TODO: maybe add some lookahead?
  function moveGreedy(
    row: number,
    col: number,
    pathRisk: number
  ): Step[] {
    const openNeighbors = getOpenNeighborCoords(row, col, rowMax, colMax);
    //console.log(`  cell (${getSlug(row, col)} ${grid[row][col]}) has pathRisk (${pathRisk}) and ${openNeighbors.length} open neighbors.`);
    //console.log(`    ${openNeighbors.map(n => `(${getSlug(n.row, n.col)} ${grid[n.row][n.col]})`)}`);
    if (openNeighbors.length == 0) {
      return [];
    }

    let cellRisk = grid[row][col];

    const idxVisits = visitedCells.length - 1;
    visitedCells[idxVisits][getSlug(row, col)] = '';

    const exit = openNeighbors.find(n => (n.row == rowMax && n.col == colMax));
    if (exit) {
      console.log('  *** found the exit ***');
      return [
        {
          row: row,
          col: col,
          risk: cellRisk,
          pathRisk: (pathRisk + cellRisk),
        },
        {
          row: exit.row,
          col: exit.col,
          risk: grid[exit.row][exit.col],
          pathRisk: (pathRisk + cellRisk + grid[exit.row][exit.col]),
        }
      ];
    }

    openNeighbors.sort((a, b) => (risks[getCrSlug(a)] - risks[getCrSlug(b)]));
    let nebRisk = 0;
    let subPath: Step[];
    for (const neb of openNeighbors) {
      nebRisk = grid[neb.row][neb.col];
      subPath = moveGreedy(neb.row, neb.col, (pathRisk + cellRisk));
      if (0 < subPath.length) {
        subPath.unshift({
          row: row,
          col: col,
          risk: cellRisk,
          pathRisk: pathRisk,
        });
        return subPath;
      }
      //console.log(`  subPath to (${getSlug(neb.row, neb.col)} ${grid[neb.row][neb.col]}) did not work`);
    }
    delete visitedCells[idxVisits][getSlug(row, col)];
    return [];
  }

  const safePath: Step[] = moveGreedy(0, 0, 0);
  printPath(safePath, rowMax, colMax);


  const pathLength = safePath.length;
  const totalRiskLevel = safePath.reduce((sum, step) => (sum + step.risk), 0);

  // not 696 -- CORRECT   not sure where the off-by-one error is
  // not 697 -- too high  this is the actual output of my code
  console.log(`Traversed (${pathLength}) cells with a total risk level of (${totalRiskLevel}).`);
}


day15_1();

