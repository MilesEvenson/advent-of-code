import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  Traverse the grid, checking each cell to see if
//  it is part of a basin (height < 9).
//  If a cell could be part of a basin,
//  check if it has already been visited,
//  then start a breadth-first traversal of the basin,
//  ignoring cells that have already been visited, or have height == 9.
//
//
// Complexity Analysis:
//  C: total number of cells in the grid
//  B: number of cells in all basins
//
//  Time Complexity:
//    O(C + B)
//    Traverse every cell in the grid,
//    plus re-traverse every cell that is in a basin
//    
//
//  Space complexity:
//    O(C + B)
//    Store the entire grid in memory,
//    plus a Set of all visited basin cells
//    plus an array of all basin cells
//
//
// Total time:  ~45 minutes
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


function loadGrid(): number[][] {
  return getLines().map(rawLine => {
    const nums = [];
    for (let c = 0; c < rawLine.length; c++) {
      nums.push(parseInt(rawLine[c], 10));
    }
    return nums;
  });
}


interface BasinCell {
  row: number;
  col: number;
  height: number;
}


interface Node {
  row: number;
  col: number;
}


function getSlug(r: number, c: number): string {
  return `${r}-${c}`;
}


function day9_2(): void {
  console.log('Welcome to Day 9.2. A watershed moment.');


  // Record basins in an array of arrays.
  // Traverse grid, searching for cells that are not height 9.
  // When I find a cell that is in a basin (value < 9),
  // explore the basin using breadth-first search, recording
  // cells in the list of basins.
  // Once the basin has been exhausted, continue the row/col
  // traversal of the grid.
  // Keep a Set of visited coordinates to avoid double counting.


  const grid = loadGrid();

  //grid.forEach(row => console.log(row.join('')));

  const basins: BasinCell[][] = [];
  const visited: Set<string> = new Set();
  const queue: Node[] = [];
  let slug = '';
  let newBasin: BasinCell[] = [];
  let node: Node;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      slug = `${r}-${c}`;
      if (grid[r][c] != 9 && !visited.has(getSlug(r, c))) {
        console.log(`Exploring new basin, starting at (${getSlug(r, c)})`);
        newBasin = [];
        queue.push({ row: r, col: c });

        while (0 < queue.length) {
          node = queue.shift() as Node;
          if (!visited.has(getSlug(node.row, node.col))) {
            if (0 < node.row
              && grid[node.row-1][node.col] != 9
              && !visited.has(getSlug(node.row-1, node.col))
            ) {
              queue.push({ row: node.row-1, col: node.col});
              console.log(`  moving North from ${getSlug(node.row, node.col)}`);
            }

            if (node.col < grid[node.row].length - 1
              && grid[node.row][node.col+1] != 9
              && !visited.has(getSlug(node.row, node.col+1))
            ) {
              queue.push({ row: node.row, col: node.col+1 });
              console.log(`  moving East from ${getSlug(node.row, node.col)}`);
            }

            if (node.row < grid.length - 1
              && grid[node.row+1][node.col] != 9
              && !visited.has(getSlug(node.row+1, node.col))
            ) {
              queue.push({ row: node.row+1, col: node.col });
              console.log(`  moving South from ${getSlug(node.row, node.col)}`);
            }

            if (0 < node.col
              && grid[node.row][node.col-1] != 9
              && !visited.has(getSlug(node.row, node.col-1))
            ) {
              queue.push({ row: node.row , col: node.col-1 });
              console.log(`  moving West from ${getSlug(node.row, node.col)}`);
            }
            visited.add(getSlug(node.row, node.col));
            newBasin.push({
              row: node.row,
              col: node.col,
              height: grid[node.row][node.col],
            });
          } else {
            console.log(`Skipping cell (${getSlug(node.row, node.col)}) because it has already been visited.`);
          }
        }
        basins.push(newBasin);
      }
    }
  }

  basins.sort((a, b) => (b.length - a.length));

  const totalArea = (basins[0].length * basins[1].length * basins[2].length);
  console.log(`Found total area (${totalArea}) for the 3 largest basins.`);
}


day9_2();

