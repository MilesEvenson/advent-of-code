import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  Process input lines into a list of coordinate pairs,
//  tracking the max X and Y values for logging.
//  For each instruction,
//    if dot is on the "far" side of the fold
//      update the appropriate coord value
//  
//
// Complexity Analysis:
//  D: total dots
//  F: total folds
//
//  Time Complexity, 13.1:
//    O(D)
//    Process each dot once for the first fold.
//
//  Time Complexity, 13.2:
//    O(D * F)
//    Process each dot once for each fold.
//
//  Space complexity:
//    O(D)
//    Store each dot as a coordinate pair in memory.
//    Technically O(2 * D) because I also store a dict of distinct coordinate pairs.
//
//
// Total time, 13.1
//                    ~60 minutes
//  Planning           20
//  Programming        10
//  Debugging          30
//
// Total time, 13.2
//                    ~1  minutes
//  Arguably, I spent a good chunk of that debugging time
//  writing a function to log the grid in a nice way,
//  which makes 13.2 much easier (just look at the pattern).
//
//
//


const SAMPLE_DOTS = [
  '6,10',
  '0,14',
  '9,10',
  '0,3',
  '10,4',
  '4,11',
  '6,0',
  '6,12',
  '4,1',
  '0,13',
  '10,12',
  '3,4',
  '3,0',
  '8,4',
  '1,10',
  '2,14',
  '8,10',
  '9,0',
];


const SAMPLE_INSTRUCTIONS = [
  'fold along y=7',
  'fold along x=5',
];


interface Coord {
  x: number;
  y: number;
}


interface Grid {
  dots: Coord[];
  maxX: number;
  maxY: number;
}


interface Instruction {
  axis: 'x' | 'y';
  offset: number;
}



function getLines(): string[] {
  let rawLines = SAMPLE_DOTS;
  if (process.env.SOURCE === 'FULL') {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data', 'day_13.input.dots.txt'));
    rawLines = buffInput.toString()
      .trim()
      .split('\n');
  }

  return rawLines;
}


function loadGrid(): Grid {
  const rawLines = getLines();

  return rawLines.reduce(
    (grid, line) => {
      const [ rawX, rawY ] =line.split(',');
      const x = parseInt(rawX, 10);
      const y = parseInt(rawY, 10);

      grid.dots.push({ x: x, y: y });

      if (grid.maxX < x) {
        grid.maxX = x;
      }
      if (grid.maxY < y) {
        grid.maxY = y;
      }
      return grid;
    },
    {
      dots: [],
      maxX: 0,
      maxY: 0,
    } as Grid
  );
}


function getInstructions(): string[] {
  let rawLines = SAMPLE_INSTRUCTIONS;
  if (process.env.SOURCE === 'FULL') {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data', 'day_13.input.instructions.txt'));
    rawLines = buffInput.toString()
      .trim()
      .split('\n');
  }

  return rawLines;
}


function loadInstructions(): Instruction[] {
  const rawLines = getInstructions();
  return rawLines.map(line => {
    const [
      fattyAxis,
      rawOffset,
    ] =line.trim().split('=');
    return {
      // Be explicit to make TypeScript compiler happy.
      axis: (fattyAxis[fattyAxis.length-1] == 'x' ? 'x' : 'y'),
      offset: parseInt(rawOffset, 10),
    };
  });
}


function printGrid(
  grid: Grid,
  inst: Instruction,
  withFold: boolean
): void {
  let line: string[];
  let pt: Coord | undefined;
  for (let y = 0; y < grid.maxY; y++) {
    line = [];
    for (let x = 0; x < grid.maxX; x++) {
      pt = grid.dots.find(d => (d.x == x && d.y == y));
      if (pt) {
        line.push('#');
      } else if (withFold && inst.axis == 'y' && inst.offset == y) {
        line.push('-');
      } else if (withFold && inst.axis == 'x' && inst.offset == x) {
        line.push('|');
      } else {
        line.push('.');
      }
    }
    console.log(line.join(''));
  }
}



function day13_1(): void {
  console.log('Welcome to Day 13.1. Hope there are no adjacent big caves.');


  const grid = loadGrid();
  const instructions = loadInstructions();

  // each fold is negative y or negative x (always toward the origin)
  // the offset is a pivot point
  // for each dot,
  //  if offset < x
  //    update x <= offset - |x - offset|


  for (const inst of instructions) {
    //console.log('\n');
    //console.log(`Will fold (${inst.axis}) at (${inst.offset})`);
    //printGrid(grid, inst, true);
    for (let d = 0; d < grid.dots.length; d++) {
      if (inst.axis == 'y') {
        if (inst.offset < grid.dots[d].y) {
          grid.dots[d].y = inst.offset - (grid.dots[d].y - inst.offset);
        }
        grid.maxY = inst.offset;
      } else if (inst.axis == 'x') {
        if (inst.offset < grid.dots[d].x) {
          grid.dots[d].x = inst.offset - (grid.dots[d].x - inst.offset);
        }
        grid.maxX = inst.offset;
      }
    }
    //console.log('\n');
    //printGrid(grid, inst, false);
    break;
  }


  const distinctCoords = grid.dots.reduce(
    (dict: Record<string, string>, coord) => {
      const slug = `${coord.x}-${coord.y}`;
      dict[slug] = slug;
      return dict;
    },
    {}
  );


  let totalDots = Object.keys(distinctCoords).length;

  // too low: 101
  // too low: 102
  // too low: 105

  console.log(`Found (${totalDots}) total dots after (${SAMPLE_INSTRUCTIONS.length}) folds.`);
}


day13_1();

