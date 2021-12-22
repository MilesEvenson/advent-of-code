//
// Initial Thoughts:
//  There are only 3 die rolls and 10 track positions.
//  Maybe possible to define loops? 
//  Getting ahead of myself.
//  What does a turn look like?
//    - 27 possible sets of rolls ( [1,1,1], [1,1,2] ... [3,3,2], [3,3,3] )
//    - move pawn
//    - update score
//
//  Can I have a count of pawns on each spot?
//  How do I turn that into scores?
//  A list of spots per player to track scores from landing on that spot.
//
//  Didn't think through this enough.
//  How to track scores and spots?
//  There are 10 strack spots.
//  Each turn there are 7 distinct moves (across 27 total rolls).
//
//  Counts of each total for all 27 permutations:
//    0   1   2   3   4   5   6   7   8   9
//    0   0   0   1   3   6   7   6   3   1
//
//
//  Turn 0, Player 0
//    p0 starts on 4
//    new locations after all 27 rolls:
//      1   2   3   4   5   6   7   8   9  10
//      6   3   1   0   0   0   1   3   6   7
//    counts of each score match counts of positions at this point.
//      6   3   1   0   0   0   1   3   6   7
//
//      1   _,0,0,0,0,0,6,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0
//      2   _,0,3,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0
//      3   _,0,0,1,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0
//      4   _,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0
//      5   _,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0
//      6   _,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0
//      7   _,0,0,0,0,0,0,1,0,0,0,  0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0
//      8   _,0,0,0,0,0,0,0,3,0,0,  0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0
//      9   _,0,0,0,0,0,0,0,0,6,0,  0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0
//     10   _,0,0,0,0,0,0,0,0,0,7,  0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0
//
//  Turn 1, Player 0
//    using the 1 pawn at spot 3
//      1   2   3   4   5   6   7   8   9  10
//      6   3   1   0   0   0   1   3   6   7
//              0   0   0   1   3   6   7   6   3   1
//      9   4   0   0   0   1   4   9  13  13
//
//    now what with scores?
//      1   _,0,0,0,3,0,6,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0
//      2   _,0,3,0,0,1,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0
//      3   _,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0
//      4   _,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0
//      5   _,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0
//      6   _,0,0,0,0,0,0,0,0,0,1, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0
//      7   _,0,0,0,0,0,0,1,0,0,3, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0
//      8   _,0,0,0,0,0,0,0,3,0,0, 6,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0
//      9   _,0,0,0,0,0,0,0,0,6,0, 0,7,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0
//     10   _,0,0,0,0,0,0,0,0,0,7, 0,0,13,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0
//
//    I could keep a list of scores for each position.
//    Similar to propagating 1 position forward to 27 positions,
//    propagate all 30 score counts forward from each position.
//    Makes sense
//    Updating example above.
//
//    I think I've been propagating my scores forward incorrectly.
//    I've been resetting them, but I think that's wrong.
//    I think new pawns should carry forward their ancestor's score.
//
//    Hmmmmm
//    I'm still not seeing huge numbers.
//    Maybe I need to branch each pawn each time the die is rolled
//    for EITHER player.
//
//
//
//
//
//


// Player 1 starting position: 4
// Player 2 starting position: 8
const SAMPLE_STARTING_POSITIONS = [
  4,
  8,
];


// Player 1 starting position: 1
// Player 2 starting position: 2
const FULL_STARTING_POSITIONS = [
  1,
  2,
];


const ROLL_COUNTS = [
//  0   1   2   3   4   5   6   7   8   9
    0,  0,  0,  1,  3,  6,  7,  6,  3,  1
];


function getStartingPositions(): number[] {
  if (process.env.SOURCE == 'FULL') {
    return FULL_STARTING_POSITIONS;
  }
  return SAMPLE_STARTING_POSITIONS;
}


// Distribution of totals:
//  0  1  2  3  4  5  6  7  8  9
//  0  0  0  1  3  6  7  6  3  1
function* newDiracDie(): Generator<number> {
  for (let a = 1; a <= 3; a++) {
    for (let b = 1; b <= 3; b++) {
      for (let c = 1; c <= 3; c++) {
        yield (a + b + c);
      }
    }
  }
}


function newTrackSpot(raw: number, trackLength: number): number {
  return 1 + ( (raw - 1) % trackLength );
}


function getFreshTrack(): number[] {
  return [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
}


function getFreshScores(): number[][] {
  return [
    [],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];
}


function day21_2(): void {
  console.log('Welcome to Day 21.2. Count every possible roll of every die.');

  const SCORE_MAX = 21;
  const TRACK_LENGTH = 10;

  const playerTracks = [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  ];
  const [
    p0Start,
    p1Start,
  ] = getStartingPositions();
  playerTracks[0][p0Start]++;
  playerTracks[1][p1Start]++;

  // The highest possible score is 30.
  // (have score of 20, then land on 10).
  // Track counts for each possible score, for each track spot, for each player.
  const allScores: number[][][] = [
    [
      [],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [
      [],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
  ];

  let die: Generator<number>;
  let roll: IteratorResult<number>;
  let newSpot = 0;
  let newScore = 0;
  let nextTrack: number[];
  let nextScores: number[][];
  let losingPlayer = -1;
  let winningPlayer = -1;
  let hasWinner = false;

  let turn = 1;

  while (!hasWinner) {
    console.log(`\nTurn ${turn}`);
    for (let p = 0; !hasWinner && p < playerTracks.length; p++) {
      console.log(`Turn for Player ${p} (${playerTracks[p].join(',')})`);
      // Assuming that the current player moves each pawn into
      // all possible new positions before checking for a win.
      // THIS MAY BE INCCORECT!

      // On each turn, for each pawn, propagate it forward for each possible roll.
      // For each of these moves, update score counts at the destination spot.
      // Then move it "off" its current spot,
      // and decrement score counts for the current spot.
      nextTrack = getFreshTrack();
      nextScores = getFreshScores();
      for (let s = 1; s < playerTracks[p].length; s++) {
        if (0 < playerTracks[p][s]) {
          for (let r = 3; r <= 9; r++) {
            newSpot = newTrackSpot((s + r), TRACK_LENGTH);
            nextTrack[newSpot] += playerTracks[p][s] * ROLL_COUNTS[r];

            console.log(`    creating (${playerTracks[p][s] * ROLL_COUNTS[r]} (${playerTracks[p][s]} * ${ROLL_COUNTS[r]})) pawns on (${newSpot}, now with ${nextTrack[newSpot]}) from (${s})`);

            // Only on the first turn, start pawns at the beginning of the score track.
            if (turn == 1) {
              nextScores[newSpot][newSpot] += nextTrack[newSpot];
            } else {
              for (let c = 1; c < allScores[p][s].length; c++) {
                if (0 < allScores[p][s][c]) {
                  newScore = c + newSpot;
                  nextScores[newSpot][newScore] += allScores[p][s][c] * ROLL_COUNTS[r];
                  if (0 < nextScores[newSpot][newScore] && 21 <= newScore) {
                    hasWinner = true;
                    winningPlayer = p;
                    losingPlayer = (p + 1) % 2;
                  }
                  //else { console.log(`  `); }
                }
              }
            }
          }
        }
      }

      console.log(`Player ${p}:`);
      console.log(`prev track ${playerTracks[p].join(',')}`);
      console.log(`next track ${nextTrack.join(',')}`);
      allScores[p].forEach((scores, spot) => console.log(`${spot}: [${scores.join(',')}]`));
      nextScores.forEach((scores, spot) => console.log(`${spot}: [${scores.join(',')}]`));

      playerTracks[p] = nextTrack;
      allScores[p] = nextScores;
    }
    turn++;
  }

  // 0: 444 356 092 776 315
  // 1: 341 960 390 180 808
  //


  console.log(`The game ended`);
}


day21_2();

// One weird trick to prevent TypeScript compiler from
// intermittently complaining about global declarations.
// https://stackoverflow.com/a/50913569
export {};

