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


function formatBoard(board: Cell[][]): string {
  const rows = board.map(row => { 
    const chunksRow = row.map(c => {
      const chunksCell = [`${c.value}`];
      if (c.isMarked) {
        chunksCell.push('*');
      } else {
        chunksCell.push(' ');
      }
      chunksCell.unshift(' ');
      if (c.value < 10) {
        chunksCell.unshift(' ');
      }
      return chunksCell.join('');
    });
    return chunksRow.join(' ');
  });
  return rows.join('\n');
}


function* nextBall(): Generator<number> {
  let index = 0;
  while (index < SAMPLE_BALLS.length) {
    //yield SAMPLE_BALLS[index];
    yield Balls[index];
    // TODO: is it advisable to put this increment before the yield?
    index++;
  }
}


function parseBoard(grid: number[][]): Cell[][] {
  return grid.map(row => row.map(i => ({ isMarked: false, value: i })));
}


function loadBoards(): Cell[][][] {
  //return SAMPLE_BOARDS.map(parseBoard);
  return RawBoards.map(parseBoard);
}


function isWinner(
  board: Cell[][],
  row: number,
  col: number
): boolean {
  const winnerRow = (
    board[row][0].isMarked
    && board[row][1].isMarked
    && board[row][2].isMarked
    && board[row][3].isMarked
    && board[row][4].isMarked
  );

  const winnerCol = (
    board[0][col].isMarked
    && board[1][col].isMarked
    && board[2][col].isMarked
    && board[3][col].isMarked
    && board[4][col].isMarked
  );

  return winnerRow || winnerCol;
}


function updateAndCheckBoards(
  nextNumber: number,
  // Passing boards by reference :(
  boards: Cell[][][]
): number {
  console.log(`The draw is (${nextNumber})`);

  for (let b = 0; b < boards.length; b++) {
    console.log('------------------------');
    for (let r = 0; r < boards[b].length; r++) {
      for (let c = 0; c < boards[b][r].length; c++) {
        if (boards[b][r][c].value === nextNumber) {
          boards[b][r][c].isMarked = true;
          if (isWinner(boards[b], r, c)) {
            return b;
          }
        }
      }
    }
    console.log(formatBoard(boards[b]));
  }
  return -1;
}


function day4_1(): void {
  console.log('Welcome to Day 4.1. Roll those cages.');

  const boards = loadBoards();
  let winnerBoard = -1;

  const cage = nextBall();
  let draw = cage.next();
  while (!draw.done) {
    // TODO: play bingo

    winnerBoard = updateAndCheckBoards(draw.value, boards);
    if (0 <= winnerBoard) {
      break;
    }

    draw = cage.next();
  }

  console.log('=========================');
  console.log(formatBoard(boards[winnerBoard]));

  const sumUnmarked = boards[winnerBoard].reduce(
    (sumRows, row) => (
      sumRows + row
        .filter(c => !c.isMarked)
        .reduce(
          (sumCol, cell) => (sumCol + cell.value),
          0
        )
    ),
    0
  );
  const lastNumber = draw.value;
  const product = sumUnmarked * lastNumber;
  console.log(`Sum (${sumUnmarked}) * Last Number (${lastNumber}) => ${product}`);
}


day4_1();

