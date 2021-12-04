import {
  Balls,
  RawBoards,
} from './day_4.input';


//
// First attempt:
//
// Complexity Analysis:
//
//  Time Complexity:
//
// Space complexity:
//
// Total time: ??? minutes
//  
//



const SAMPLE_BALLS = [
  7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1
];


// Three dimensional array 😆
const SAMPLE_BOARDS: number[][][] = [

  [
    [ 22, 13, 17, 11,  0 ],
    [  8,  2, 23,  4, 24 ],
    [ 21,  9, 14, 16,  7 ],
    [  6, 10,  3, 18,  5 ],
    [  1, 12, 20, 15, 19 ],
  ],

  [
    [  3, 15,  0,  2, 22 ],
    [  9, 18, 13, 17,  5 ],
    [ 19,  8,  7, 25, 23 ],
    [ 20, 11, 10, 24,  4 ],
    [ 14, 21, 16, 12,  6 ],
  ],

  [
    [ 14, 21, 17, 24,  4 ],
    [ 10, 16, 15,  9, 19 ],
    [ 18,  8, 23, 26, 20 ],
    [ 22, 11, 13,  6,  5 ],
    [  2,  0, 12,  3,  7 ],
  ],

];


interface Cell {
  isMarked: boolean;
  value: number;
}



function* nextBall(): Generator<number> {
  let index = 0;
  while (index < SAMPLE_BALLS.length) {
    yield index;
    // TODO: is it advisable to put this increment before the yield?
    index++;
  }
}


function parseBoard(grid: number[][]): Cell[][] {
  return grid.map(row => row.map(i => ({ isMarked: false, value: i })));
}


function loadBoards(): Cell[][][] {
  return SAMPLE_BOARDS.map(parseBoard);
  //return RawBoards.map(parseBoard);
}


function day4_1(): void {
  console.log('Welcome to Day 4.1. Roll those cages.');

  const boards = loadBoards();
  console.dir(boards, { depth: null, maxArrayLength: null });

  let cage = nextBall();
  let draw = cage.next();
  while (!draw.done) {
    console.log(`drew (${draw.value})`);
    draw = cage.next();
  }

  const sumUnmarked = 0;
  const lastNumber = 0;
  const product = sumUnmarked * lastNumber;
  console.log(`Sum (${sumUnmarked}) * Last Number (${lastNumber}) => ${product}`);
}


day4_1();

