import {
  Balls,
  RawBoards,
} from './data/day_4.input';


//
// First attempt:
//  Record each board when it wins and skip it in future iterations.
//  Eventually there is only 1 board left and we use it.
//  I brought the logic back into the main loop. No more passing by reference!
//
//  Remember to be careful switching between sample/full data
//  because I keep tripping over this and burning time debugging
//  solution logic that is fine when the problem is in the code
//  that loads input data.
//
//
// Complexity Analysis:
//  B: number of boards
//  R: rows per board
//  C: columns per board
//
//  Time Complexity:
//    O(B*R*C)
//    For each new number, traverse every open board looking for a match.
//    This technically speeds up as boards win and stop getting processed.
//    In the worst case, though, you still fill 16/25 (64%) cells on every
//    board before any start winning, so this isn't a major source of improvement.
//
//  Space complexity:
//    O(B*R*C)
//    Just a big 3-dimensional array,
//    plus the not-actually-important O(R) Set holding indexes for open boards.
//
//
// Total time: ~45 minutes
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
  //while (index < SAMPLE_BALLS.length) {
  //  yield SAMPLE_BALLS[index];
  //  // TODO: is it advisable to put this increment before the yield?
  //  index++;
  //}
  while (index < Balls.length) {
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


function day4_2(): void {
  console.log('Welcome to Day 4.2. Find the last board standing.');

  const boards = loadBoards();
  const openBoards: Set<number> = new Set(boards.map((_, idx) => idx));
  let idxFinalBoard = 0;
  let lastNumber = -1;
  let breakBoard = false;

  const cage = nextBall();
  let draw;
  do {
    draw = cage.next();
    lastNumber = draw.value;
    console.log(`The draw is (${draw.value})`);

    for (let b = 0; b < boards.length; b++) {
      if (!openBoards.has(b)) {
        continue;
      }

      console.log('------------------------');

      // Hack-ish way to break out of both row/col loops.
      breakBoard = false;
      for (let r = 0; !breakBoard && r < boards[b].length; r++) {
        for (let c = 0; !breakBoard && c < boards[b][r].length; c++) {
          if (!boards[b][r][c].isMarked && boards[b][r][c].value === draw.value) {
            boards[b][r][c].isMarked = true;
            if (isWinner(boards[b], r, c)) {
              console.log(`Board (${b}) is a winner. There are now (${openBoards.size}) open boards.`);
              idxFinalBoard = b;
              openBoards.delete(b);
              breakBoard = true;
            }
          }
        }
      }
      console.log(formatBoard(boards[b]));
    }
    if (openBoards.size === 0) {
      console.log(`openBoards is empty. Last number was (${lastNumber})`);
    }
    if (draw.done) {
      console.log(`draw is done. Last number was (${lastNumber})`);
    }
  } while (0 < openBoards.size && !draw.done);

  console.log('=========================');
  console.log(formatBoard(boards[idxFinalBoard]));

  const sumUnmarked = boards[idxFinalBoard].reduce(
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
  const product = sumUnmarked * lastNumber;
  console.log(`Sum (${sumUnmarked}) * Last Number (${lastNumber}) => ${product}`);
}


day4_2();

