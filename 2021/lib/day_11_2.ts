import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  Store a grid with two "layers" that represent the
//  current state and the next state.
//  On each step:
//    1. do a full row/col pass
//      - increment each cell in the next layer
//      - if the next layer value is a flash, add that cell to a dict
//    2. For each flashed cell, do a breadth-first traversal of the grid
//        incrementing each unflashed neighbor, and adding flashes to
//        the queue to be processed the same way.
//
//
// Complexity Analysis:
//  N: total number of cells
//
//  Time Complexity:
//    O(N)
//    Process each cell once.
//    Technically O(2N) because each cell could be processed in step 2.
//
//  Space complexity:
//    O(N)
//    Store the full grid in memory
//    Technically O(2N) because the flashers dictionary could hold every cell.
//
//
// Total time:   ~65 minutes
//  Planning      15
//  Programming   35
//  Debugging     15
//



const SAMPLE_LINES = [
  '5483143223',
  '2745854711',
  '5264556173',
  '6141336146',
  '6357385478',
  '4167524645',
  '2176841721',
  '6882881134',
  '4846848554',
  '5283751526',
];


function getLines(): string[] {
  let rawLines = SAMPLE_LINES;
  if (process.env.SOURCE === 'FULL') {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data', 'day_11.input.txt'));
    rawLines = buffInput.toString()
      .trim()
      .split('\n');
  }

  return rawLines;
}


function loadGrid(): number[][][] {
  const lines = getLines();
  return lines.map((rawRow): number[][] => {
    const gridRow: number[][] = [];
    for (let c = 0; c < rawRow.length; c++) {
      gridRow.push([ parseInt(rawRow[c], 10), parseInt(rawRow[c], 10) ]);
    }
    return gridRow;
  });
}


interface Cell {
  row: number;
  col: number;
  z: number;
}


function getSlug(row: number, col: number, z: number): string {
  return `${row}-${col}-${z}`;
}



function day11_2(): void {
  console.log('Welcome to Day 11.2. Wating for syncronization.');

  // The grid has 2 layers that will represent the current and next states.
  // Update cells in the next layer.
  // Keep dictionary of coords for cells that have flashed
  //  to prevent overloading and double flashes.
  // Do a row/col traversal to increment all cells.
  // If a cell's counter goes above 9, add it to the set.
  // Then perform breadth-first traversal from each flasher.
  // If everyone flashed in that step, break out of the outer loop.
  // Otherwise, empty the dict and run the loop again.


  // Use functions in this scope so they can access grid and flashers.
  function getUnflashedNeighbors(row: number, col: number, z: number): Cell[] {
    const cells: Cell[] = [];
    // Check cells, starting with North, then proceding clockwise to NW.
    if (0 < row
      && !flashers.hasOwnProperty(getSlug(row-1, col, z))
    ) {
      //console.log(`  North (${grid[row-1][col][0]} // ${grid[row-1][col][1]})`);
      cells.push({ row: row-1, col, z: z });
    }
    if (col < grid[row].length - 1
      && 0 < row
      && !flashers.hasOwnProperty(getSlug(row-1, col+1, z))
    ) {
      //console.log(`  NorthEast (${grid[row-1][col+1][0]} // ${grid[row-1][col+1][1]})`);
      cells.push({ row: row-1, col: col+1, z: z });
    }
    if (col < grid[row].length - 1
      && !flashers.hasOwnProperty(getSlug(row, col+1, z))
    ) {
      //console.log(`  East (${grid[row][col+1][0]} // ${grid[row][col+1][1]})`);
      cells.push({ row: row, col: col+1, z: z });
    }
    if (col < grid[row].length - 1
      && row < grid.length - 1
      && !flashers.hasOwnProperty(getSlug(row+1, col+1, z))
    ) {
      //console.log(`  SouthEast (${grid[row+1][col+1][0]} // ${grid[row+1][col+1][1]})`);
      cells.push({ row: row+1, col: col+1, z: z });
    }
    if (row < grid.length - 1
      && !flashers.hasOwnProperty(getSlug(row+1, col, z))
    ) {
      //console.log(`  South (${grid[row+1][col][0]} // ${grid[row+1][col][1]})`);
      cells.push({ row: row+1, col: col, z: z });
    }
    if (0 < col
      && row < grid.length - 1
      && !flashers.hasOwnProperty(getSlug(row+1, col-1, z))
    ) {
      //console.log(`  SouthWest (${grid[row+1][col-1][0]} // ${grid[row+1][col-1][1]})`);
      cells.push({ row: row+1, col: col-1, z: z });
    }
    if (0 < col
      && !flashers.hasOwnProperty(getSlug(row, col-1, z))
    ) {
      //console.log(`  West (${grid[row][col-1][0]} // ${grid[row][col-1][1]})`);
      cells.push({ row: row, col: col-1, z: z });
    }
    if (0 < col
      && 0 < row
      && !flashers.hasOwnProperty(getSlug(row-1, col-1, z))
    ) {
      //console.log(`  NorthWest (${grid[row-1][col-1][0]} // ${grid[row-1][col-1][1]})`);
      cells.push({ row: row-1, col: col-1, z: z });
    }
    return cells;
  }


  const grid = loadGrid();

  const EVERYONE = grid.length * grid[0].length;
  let steps = 0;
  let stepFlashes = 0;
  let queue: Cell[] = [];
  let neighbors = [];
  let cell: Cell;
  let flashers: Record<string, Cell> = {};
  let z = 0;
  let nz = 1;


  while (stepFlashes < EVERYONE) {
    stepFlashes = 0;
    // row/col traversal to increment
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        grid[r][c][nz] = grid[r][c][z] + 1;
        if (9 < grid[r][c][nz]) {
          stepFlashes++;
          grid[r][c][nz] = 0;
          flashers[getSlug(r, c, nz)] = { row: r, col: c, z: nz };
        }
      }
    }

    //console.log('------------');
    //console.log(`After initial pass for step (${steps})`);
    //console.log('------------');
    //grid.forEach((row, idxRow) => {
    //  const cells: string[] = [];
    //  let modifier = '';
    //  for (let c = 0; c < row.length; c++) {
    //    if (flashers.hasOwnProperty(getSlug(idxRow, c, nz))) {
    //      // bright white
    //      modifier = '\x1b[1m\x1b[37m';
    //    } else {
    //      // dim
    //      modifier = '\x1b[2m';
    //    }
    //    cells.push(`${modifier}${row[c][nz]}\x1b[0m`);
    //  }
    //  console.log(cells.join(''));
    //});


    queue = Object.values(flashers);
    // breadth-first traversal to handle chain reactions.
    while (0 < queue.length) {
      cell = queue.shift() as Cell;
      neighbors = getUnflashedNeighbors(cell.row, cell.col, cell.z);
      neighbors.forEach(n => {
        grid[n.row][n.col][n.z]++;
        if (9 < grid[n.row][n.col][n.z]) {
          stepFlashes++;
          grid[n.row][n.col][n.z] = 0;
          flashers[getSlug(n.row, n.col, n.z)] = { row: n.row, col: n.col, z: n.z };
          queue.push(flashers[getSlug(n.row, n.col, n.z)]);
        }
      });
    }

    //console.log('------------');
    //console.log(`Final state after step (${steps})`);
    //console.log('------------');
    //grid.forEach((row, idxRow) => {
    //  const cells: string[] = [];
    //  let modifier = '';
    //  for (let c = 0; c < row.length; c++) {
    //    if (flashers.hasOwnProperty(getSlug(idxRow, c, nz))) {
    //      // bright white
    //      modifier = '\x1b[1m\x1b[37m';
    //    } else {
    //      // dim
    //      modifier = '\x1b[2m';
    //    }
    //    cells.push(`${modifier}${row[c][nz]}\x1b[0m`);
    //  }
    //  console.log(cells.join(''));
    //});


    z = (z + 1) % 2;
    nz = (nz + 1) % 2;
    flashers = {};
    steps++;
  }
  

  console.log(`Everyone flashed on step (${steps}).`);
}


day11_2();

