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


function calculateAverages(grid: number[][], offset: number): number[][] {
  const averages: number[][] = [];
  let row: number[];
  let rowMin = 0;
  let rowMax = 0;
  let colMin = 0;
  let colMax = 0;
  let areaSum = 0;
  let areaSize = 0;
  let average = 0.0;

  for (let r = 0; r < grid.length; r++) {
    row = [];
    rowMin = Math.max(0, r-offset);
    rowMax = Math.min(grid.length-1, r+offset);
    for (let c = 0; c < grid[r].length; c++) {
      colMin = Math.max(0, c-offset);
      colMax = Math.min(grid[r].length-1, c+offset);
      areaSize = 0;
      areaSum = 0;

      //for (let y = rowMin; y <= rowMax; y++) {
      //  for (let x = colMin; x <= colMax; x++) {
      //    areaSize++;
      //    areaSum += grid[y][x];
      //  }
      //}
      if (0 < r) {
        areaSize++;
        areaSum += grid[r-1][c];
      }
      if (c < grid[r].length-1) {
        areaSize++;
        areaSum += grid[r][c+1];
      }
      if (r < grid.length-1) {
        areaSize++;
        areaSum += grid[r+1][c];
      }
      if (0 < c) {
        areaSize++;
        areaSum += grid[r][c-1];
      }

      average = Math.floor(100 * (areaSum / areaSize)) / 100;
      row.push(average);
    }
    averages.push(row);
  }

  return averages;
}


function printHeatmap(grid: number[][]): void {
  //console.log(SPECTRUM.map(c => `${c}0${C_RESET}`).join(''));

  let rowVals: string[] = [];
  let colorIndex = 0;
  let color = '';
  for (let r = 0; r < grid.length; r++) {
    rowVals = [];
    for (let c = 0; c < grid[r].length; c++) {
      colorIndex = Math.round(grid[r][c]) - 1;
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
          const colorIndex = Math.floor(idx / SPECTRUM.length);
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

    if (
      0 < row
      && !visitedCells[idxVisits].hasOwnProperty(slugNorth)
      && blockedMoves[idxVisits][slugHere] != slugNorth
    ) {
      coords.push({ row: row-1, col: col });
    }
    if (
      col < colMax
      && !visitedCells[idxVisits].hasOwnProperty(slugEast)
      && blockedMoves[idxVisits][slugHere] != slugEast
    ) {
      coords.push({ row: row, col: col+1 });
    }
    if (
      row < rowMax
      && !visitedCells[idxVisits].hasOwnProperty(slugSouth)
      && blockedMoves[idxVisits][slugHere] != slugSouth
    ) {
      coords.push({ row: row+1, col: col });
    }
    if (
      0 < col
      && !visitedCells[idxVisits].hasOwnProperty(slugWest)
      && blockedMoves[idxVisits][slugHere] != slugWest
    ) {
      coords.push({ row: row, col: col-1 });
    }
    return coords;
  }


  const grid = parseGrid(getGrid());
  //printHeatmap(calculateAverages(grid, 1));
  const rowMax = grid.length - 1;
  const colMax = grid[0].length - 1;

  const visitedCells: Record<string, string>[] = [{'0-0': '0-0'}];
  const blockedMoves: Record<string, string>[] = [{}];
  const allPaths: Step[][] = [];
  let basePath: Step[] = [
    {
      row: 0,
      col: 0,
      risk: 0,
      pathRisk: 0,
    },
  ];
  let tip = 0;
  let allNeighbors: Coord[] = [];
  let openNeighbors: Coord[];
  let minRiskCoord: Coord;


  function moveGreedy(
    row: number,
    col: number,
    pathRisk: number,
    maxRisk: number,
  ): Step[] {
    const openNeighbors = getOpenNeighborCoords(row, col, rowMax, colMax);
    //console.log(`  cell (${getSlug(row, col)} ${grid[row][col]}) has pathRisk (${pathRisk}) and ${openNeighbors.length} open neighbors.`);
    //console.log(`    ${openNeighbors.map(n => `(${getSlug(n.row, n.col)} ${grid[n.row][n.col]})`)}`);
    if (openNeighbors.length == 0) {
      return [];
    }

    let cellRisk = grid[row][col];

    if (0 < maxRisk && maxRisk <= (pathRisk + cellRisk)) {
      //console.log(`  too risky at cell (${getSlug(row, col)} ${grid[row][col]}).`);
      return [];
    }

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

    openNeighbors.sort((a, b) => (grid[a.row][a.col] - grid[b.row][b.col]));
    let nebRisk = 0;
    let subPath: Step[];
    for (const neb of openNeighbors) {
      nebRisk = grid[neb.row][neb.col];
      subPath = moveGreedy(neb.row, neb.col, (pathRisk + cellRisk), maxRisk);
      if (0 < subPath.length) {
        subPath.unshift({
          row: row,
          col: col,
          risk: cellRisk,
          //pathRisk: (pathRisk + grid[row][col]),
          pathRisk: pathRisk,
        });
        // Track how this path got to neb to handle an edge case while finding altPath.
        visitedCells[idxVisits][getSlug(neb.row, neb.col)] = getSlug(row, col);
        return subPath;
      }
      //console.log(`  subPath to (${getSlug(neb.row, neb.col)} ${grid[neb.row][neb.col]}) did not work`);
    }

    delete visitedCells[idxVisits][getSlug(row, col)];
    return [];
  }

  allPaths.push(moveGreedy(0, 0, 0, 0));
  visitedCells.push({ ...visitedCells[0] });
  blockedMoves.push({});
  console.log('---- BASE PATH ----');
  console.log(allPaths[0]);
  printPath(allPaths[0], rowMax, colMax);

  let idxVisits = 1;
  let altPath: Step[] = [];
  let maxRisk = allPaths[0][allPaths[0].length-1].pathRisk;

  // This is heinous. Basically, open up the last couple cells.
  delete visitedCells[idxVisits][getSlug(allPaths[0][allPaths[0].length-1].row, allPaths[0][allPaths[0].length-1].col)];
  delete visitedCells[idxVisits][getSlug(allPaths[0][allPaths[0].length-2].row, allPaths[0][allPaths[0].length-2].col)];
  delete visitedCells[idxVisits][getSlug(allPaths[0][allPaths[0].length-3].row, allPaths[0][allPaths[0].length-3].col)];

  // Start at the fourth-to-last step, where real alternatives exist.
  //  - length-1: This is the exit. It's not worth starting here.
  //  - length-2: This is adjacent to exit. There is no safer alternate path starting from here.
  //  - length-3: Greedy chose this as the safest cell adjacent to exit, can't do better than this.
  //  - length-4: Finally, a cell with reasonable alternate paths.
  for (let ib = allPaths[0].length - 4; 0 <= ib; ib--) {
    // Specifically block moving from the current backtrack start cell
    // to the next cell in the base path to prevent a repeat of that path.
    blockedMoves[idxVisits][getSlug(allPaths[0][ib].row, allPaths[0][ib].col)] = getSlug(allPaths[0][ib+1].row, allPaths[0][ib+1].col);

    console.log(`Backtracking (${allPaths[0].length - 1 - ib}) steps to cell (${getSlug(allPaths[0][ib].row, allPaths[0][ib].col)} ${grid[allPaths[0][ib].row][allPaths[0][ib].col]})`);
    //console.dir(visitedCells[idxVisits]);
    //console.dir(blockedMoves[idxVisits]);

    altPath = moveGreedy(
      allPaths[0][ib].row,
      allPaths[0][ib].col,
      allPaths[0][ib].pathRisk,
      maxRisk
    );
    if (0 < altPath.length) {
      if (altPath[altPath.length-1].pathRisk < maxRisk) {
        //console.log('  >>>> Found new, safer path.');
        maxRisk = altPath[altPath.length-1].pathRisk;
        allPaths.push(allPaths[0].slice(0, ib+1).concat(altPath));
        visitedCells.push({ ...visitedCells[idxVisits] });
        blockedMoves.push({});
        idxVisits = visitedCells.length - 1;
      } else {
        //console.log('ERROR - found an alt path with unacceptible risk');
      }
    }
    delete blockedMoves[idxVisits][getSlug(allPaths[0][ib].row, allPaths[0][ib].col)];
    delete visitedCells[idxVisits][getSlug(allPaths[0][ib].row, allPaths[0][ib].col)];
  }

  console.dir(allPaths);


  const pathLength = allPaths[allPaths.length-1].length;
  const totalRiskLevel = allPaths[allPaths.length-1].reduce((sum, step) => (sum + step.risk), 0);

  console.log(`Traversed (${pathLength}) cells with a total risk level of (${totalRiskLevel}).`);
}


day15_1();

