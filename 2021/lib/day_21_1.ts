//
// Initial Thoughts:
//  The brute force approach here is probably fine.
//  while scores < 1000
//    for each player
//      take rolls
//      update pawn position
//      update player score
//      break if winning score
//  
//
//
//
//


const C_RESET = '\x1b[0m';


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


function getStartingPositions(): number[] {
  if (process.env.SOURCE == 'FULL') {
    return FULL_STARTING_POSITIONS;
  }
  return SAMPLE_STARTING_POSITIONS;
}


function* newGameDie(): Generator<number> {
  let roll = 1;
  while (true) {
    yield roll;
    // TODO: is it advisable to put this increment before the yield?
    roll++;
    if (100 < roll) {
      roll = 1;
    }
  }
}


function newTrackSpot(raw: number, trackLength: number): number {
  return 1 + ( (raw - 1) % trackLength );
}


function day21_1(): void {
  console.log('Welcome to Day 21.1. Roll that die.');

  const SCORE_MAX = 1000;
  const TRACK_LENGTH = 10;

  const positions = getStartingPositions();
  const scores = positions.map(_ => 0);
  const gameDie = newGameDie();

  const debugRolls = [0, 0, 0];

  let turnRoll = 0;
  let rawPosition = 0;
  let totalRolls = 0;
  let hasWinner = false;
  let losingPlayer = -1;
  let winningPlayer = -1;

  while (!hasWinner) {
    for (let p = 0; !hasWinner && p < positions.length; p++) {
      console.log(`Turn for Player ${p}`);
      debugRolls[0] = gameDie.next().value as number;
      debugRolls[1] = gameDie.next().value as number;
      debugRolls[2] = gameDie.next().value as number;
      turnRoll = debugRolls[0] + debugRolls[1] + debugRolls[2];
      totalRolls += 3;
      console.log(`  rolled (${turnRoll}) from (${debugRolls.join(', ')})`);

      rawPosition = positions[p] + turnRoll;
      console.log(`  moving to track position (${newTrackSpot(rawPosition, TRACK_LENGTH)}, raw: ${rawPosition}) from (${positions[p]})`);
      positions[p] = newTrackSpot(rawPosition, TRACK_LENGTH);

      console.log(`  scoring ${positions[p]} points`);
      scores[p] += positions[p];

      if (SCORE_MAX <= scores[p]) {
        hasWinner = true;
        losingPlayer = (p + 1) % 2;
        winningPlayer = p;
      }
    }
  }

  const product = scores[losingPlayer] * totalRolls;

  console.log(`The game ended after (${totalRolls}) rolls.`);
  console.log('Scores:');
  scores.forEach((s, idx) => console.log(`Player ${idx+1}: ${s}`));
  console.log(`\nProduct: ${product}`);
}


day21_1();


// One weird trick to prevent TypeScript compiler from
// intermittently complaining about global declarations.
// https://stackoverflow.com/a/50913569
export {};

