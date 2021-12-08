const fs = require('fs');
const path = require('path');


//
// First attempt:
//  One grid, each cell has two layers:
//    - current state
//    - updates for next state
//  Swap "current" layer each iteration.
//
//
// Complexity Analysis:
//  C: total number of cells
//  I: number of iteratations for simulation to stabilize.
//
//  Time Complexity:
//    O(C * I)
//    Touch every cell for each iteration
//
//  Space complexity:
//    O(C)
//    We store two cell values for each coordinate pair.
//
//
// Total time:  ~90 minutes
//  Blunders:
//    - forgot to update nz cell values when there is no change
//    - off-by-one in East and South bounds checking
//  Together they cost me ~20 minutes.
//


const SAMPLE_SEATS = [
  'L.LL.LL.LL',
  'LLLLLLL.LL',
  'L.L.L..L..',
  'LLLL.LL.LL',
  'L.LL.LL.LL',
  'L.LLLLL.LL',
  '..L.L.....',
  'LLLLLLLLLL',
  'L.LLLLLL.L',
  'L.LLLLL.LL',
];


const SEAT_OPEN = 'L';
const SEAT_TAKEN = '#';


function getSeats() {
  let seats = SAMPLE_SEATS.slice();
  if (process.env.SOURCE === 'FULL') {
    const filename = path.resolve(__dirname, 'day_11.data.txt');
    const rawSeats = fs.readFileSync(filename, { encoding: 'UTF-8' });
    seats = rawSeats
      .trim()
      .split('\n');
  }
  return seats;
}


function main() {
  const floorPlan = getSeats();

  const grid = floorPlan.map(row => {
    let cells = [];
    for (let c = 0; c < row.length; c++) {
      cells.push([ row[c], row[c] ]);
    }
    return cells;
  });
  grid.forEach(row => console.log(row.map(c => c[0]).join('')));


  // Use functions in this scope so they can peek at grid.
  function getAdjacentSeats(row, col) {
    const seats = [];
    // Check seats, starting with North, then proceding clockwise to NW.
    if (0 < row) {
      //console.log(`  North (${grid[row-1][col][0]} // ${grid[row-1][col][1]})`);
      seats.push(grid[row-1][col]);
    }
    if (col < grid[row].length - 1 && 0 < row) {
      //console.log(`  NorthEast (${grid[row-1][col+1][0]} // ${grid[row-1][col+1][1]})`);
      seats.push(grid[row-1][col+1]);
    }
    if (col < grid[row].length - 1) {
      //console.log(`  East (${grid[row][col+1][0]} // ${grid[row][col+1][1]})`);
      seats.push(grid[row][col+1]);
    }
    if (col < grid[row].length - 1 && row < grid.length - 1) {
      //console.log(`  SouthEast (${grid[row+1][col+1][0]} // ${grid[row+1][col+1][1]})`);
      seats.push(grid[row+1][col+1]);
    }
    if (row < grid.length - 1) {
      //console.log(`  South (${grid[row+1][col][0]} // ${grid[row+1][col][1]})`);
      seats.push(grid[row+1][col]);
    }
    if (0 < col && row < grid.length - 1) {
      //console.log(`  SouthWest (${grid[row+1][col-1][0]} // ${grid[row+1][col-1][1]})`);
      seats.push(grid[row+1][col-1]);
    }
    if (0 < col) {
      //console.log(`  West (${grid[row][col-1][0]} // ${grid[row][col-1][1]})`);
      seats.push(grid[row][col-1]);
    }
    if (0 < col && 0 < row) {
      //console.log(`  NorthEast (${grid[row-1][col-1][0]} // ${grid[row-1][col-1][1]})`);
      seats.push(grid[row-1][col-1]);
    }
    return seats;
  }

  // Use functions in this scope so they can peek at grid.
  function isCrowded(row, col, layer) {
    if (grid[row][col][layer] !== SEAT_TAKEN) {
      return false;
    }
    //console.log('----');
    //console.log(`Checking Crowding neighbors for seat (${row}, ${col}, ${layer})`);
    const neighbors = getAdjacentSeats(row, col);
    const countNeighbors  = neighbors.reduce(
      (sum, seat) => (seat[layer] === SEAT_TAKEN ? (sum + 1) : sum),
      0
    );
    return (4 <= countNeighbors);
  }

  // Use functions in this scope so they can peek at grid.
  function isTempting(row, col, layer) {
    if (grid[row][col][layer] !== SEAT_OPEN) {
      return false;
    }
    //console.log(`Checking Open neighbors for seat (${row}, ${col}, ${layer})`);
    const neighbors = getAdjacentSeats(row, col);
    const countNeighbors = neighbors.reduce(
      (sum, seat) => (seat[layer] === SEAT_TAKEN ? (sum + 1) : sum),
      0
    );
    return (countNeighbors === 0);
  }


  let countIterations = 0;
  let countOpen = 0;
  let countTaken = 0;
  let shouldUpdate = true;
  // To keep things simple, store two "Z" layers in the grid,
  // one for the current state, one for the next state.
  // Togle between them as the simulation runs.
  let z = 0;
  let nz = 1;
  while (shouldUpdate) {
    shouldUpdate = false;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (isCrowded(r, c, z)) {
          grid[r][c][nz] = SEAT_OPEN;
          countOpen++;
          countTaken--;
          shouldUpdate = true;
        } else if (isTempting(r, c, z)) {
          grid[r][c][nz] = SEAT_TAKEN;
          if (0 < countOpen) {
            countOpen--;
          }
          countTaken++;
          shouldUpdate = true;
        } else {
          grid[r][c][nz] = grid[r][c][z];
        }
      }
    }

    console.log(`Completed iteration (${countIterations}) on layer (${z})`);
    console.log(`There are (${countOpen}) open, (${countTaken}) taken seats.`);

    //grid.forEach(r => {
    //  const zRow = r.map(c => c[z]).join('');
    //  const nzRow = r.map(c => c[nz]).join('');
    //  console.log(`${zRow}   ${nzRow}`);
    //});

    countIterations++;
    z = (z + 1) % 2;
    nz = (nz + 1) % 2;
  }

  console.log(`Processed (${countIterations}) iterations for (${countOpen + countTaken}) total seats.`);
  console.log(`There are (${countTaken}) taken seats.`);
}


main();
