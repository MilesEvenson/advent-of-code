import * as fs from 'fs';
import path from 'path';


//
// First Idea:
//  Add a bit of logic to increase the grid size,
//  then run the same code I used for 15.1.
//  --> DID NOT WORK
//
//  Looking at the aggregate risk values near
//  the entrance (0, 0), My guess is that my
//  code hanve any logic for handling ties.
//  Unfortunately, even looking ahead 10 steps
//  in the 50x50 (10x10) sample grid, the path
//  my code finds is safer
//  230 at [5,5] vs 240 at [9,0]).
//
//    257 257 256 250 250 243 246 248 242 243
//    257 257 255 247 246 243 245 247 239 238
//    256 254 253 250 247 242 242 241 238 238
//    254 254 253 244 249 240 242 241 232 239
//    251 248 246 240 241 237 236 234 228 230
//    244 244 243 237 237 230 232 231 225 226
//    246 245 242 234 233 230 231 230 222 221
//    245 243 242 239 234 229 228 230 227 221
//    243 243 242 233 236 227 227 230 221 227
//    240 237 235 229 228 224 221 223 217 218
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


function parseGrid(
  rawLines: string[],
  blockMultiplier: number
): number[][] {
  const grid: number[][] = [];

  let blockHeight = rawLines.length;
  let blockWidth = rawLines[0].length;

  let rowBonus = 0;
  let colBonus = 0;
  let cellValue = 0;

  let safeR = 0;
  let safeC = 0;

  let row: number[];
  for (let r = 0; r < (blockHeight * blockMultiplier); r++) {
    safeR = r % blockMultiplier;
    rowBonus = Math.floor(r / blockHeight);
    row = [];
    for (let c = 0; c < (blockWidth * blockMultiplier); c++) {
      safeC = c % blockMultiplier;
      colBonus = Math.floor(c / blockWidth);
      cellValue = (parseInt(rawLines[safeR][safeC], 10) + rowBonus + colBonus) % 10;
      row.push(cellValue);
    }
    grid.push(row);
  }
  return grid;
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
      rowVals.push(`${pad}${color}${Math.round(dict[slug])}${C_RESET} `);
      //rowVals.push(`${color}${grid[r][c]}${C_RESET}`);
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
  console.log('Welcome to Day 15.2. Scaling up is easy (hopefully)');

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


  const grid = parseGrid(getGrid(), 5);
  //grid.forEach(row => console.log(row.join('')));
  //printHeatmapFromGrid(grid);
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

