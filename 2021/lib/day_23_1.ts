//
// Initial Thoughts:
//  I have no idea.
//  This feels like a problem that would take recursion well.
//  Feels similar to the Towers of Hanoi problem.
//  Maybe I want shared state between iterations? Not sure.
//
//  Parts of this problem:
//    - select/identify a target room for an Amphipod
//    - select/identify a move target for an Amphipod,
//      e.g.  "move out of room to spot adjacent to door"
//      or    "move out of room to spot deep in hallway"
//    - logic to choose between "get Amphipod out of the way"
//      vs "move Amphipod to target room"
//      - Technically, these overlap because most Amphipods
//        must leave the initial room.
//
//  This list doesn't feel too helpful.
//
//
//  Maybe I'm overthinking.
//  What does a brute force approach look like?
//  Can I execute every possible move until
//  I find a solution or a deadlock?
//    Step 0
//      There are 7 valid target spots from the initial state
//      and 4 Amphipods that can move, so 28 possible moves.
//    Step 1
//      Then there are up to 6 valid target spots, depending
//      on the step 0 move, and 4 Amphipods that can move.
//        - I'm not allowing a redundant second move by
//          the previous step's Amphipod.
//        - I'm not counting getting an Amphipod into its
//          target room.
//      There are up to 24 possible moves.
//
//  This yields ~700 moves going into step 2.
//
//  As I think through a brute force approach
//  I worry ub degenerate repeated sequences
//  e.g. moving two Amphipods back-and-forth
//  from one end of the hallway to the other.
//
//  So! What logic do I want?
//    - Determine which room is cheapest to empty next.
//    - Determine which moves are needed to empty a room.
//    - Determine which moves are needed to fill a room.
//
//  Simplified situation:
//    #######
//    #.....#
//    ##B#B##
//     #A#A#
//     #####
//      3 5
//
//  Which room is cheapest to empty?
//    Room 3 (20)
//      B0  ->  h0  20 (2*10)
//    Room 5 (23)
//      B1  ->  h4  20 (2*10)
//      A1  ->  h4   3 (3*1)
//
//  Once a room is empty, or partially complete,
//  find Amphipods that will move to it.
//  
//
//
// Reflections:
//
//
//


const C_RESET = '\x1b[0m';



//  #######
//  #.....#
//  ##B#B##
//   #A#A#
//   #####
const SAMPLE_SMALL_B_UP = [
  [ '#', '#', '#', '#', '#', '#', '#' ],
  [ '#', '.', '.', '.', '.', '.', '#' ],
  [ '#', '#', 'B', '#', 'B', '#', '#' ],
  [ '#', '#', 'A', '#', 'A', '#', '#' ],
  [ '#', '#', '#', '#', '#', '#', '#' ],
];


//  #######
//  #.....#
//  ##B#A##
//   #A#B#
//   #####
const SAMPLE_SMALL_AB_MIX = [
  [ '#', '#', '#', '#', '#', '#', '#' ],
  [ '#', '.', '.', '.', '.', '.', '#' ],
  [ '#', '#', 'B', '#', 'A', '#', '#' ],
  [ '#', '#', 'A', '#', 'B', '#', '#' ],
  [ '#', '#', '#', '#', '#', '#', '#' ],
];


//  #############
//  #...........#
//  ###B#C#B#D###
//    #A#D#C#A#
//    #########
const SAMPLE_DATA = [
  [ '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#' ],
  [ '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#' ],
  [ '#', '#', '#', 'B', '#', 'C', '#', 'B', '#', 'D', '#', '#', '#' ],
  [ '#', '#', '#', 'A', '#', 'D', '#', 'C', '#', 'A', '#', '#', '#' ],
  [ '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#' ],
];



//  #############
//  #...........#
//  ###C#B#D#A###
//    #B#D#A#C#
//    #########
const FULL_DATA = [
  [ '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#' ],
  [ '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#' ],
  [ '#', '#', '#', 'C', '#', 'B', '#', 'D', '#', 'A', '#', '#', '#' ],
  [ '#', '#', '#', 'B', '#', 'D', '#', 'A', '#', 'C', '#', '#', '#' ],
  [ '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#' ],
];


const COSTS = {
  A:      1,
  B:     10,
  C:    100,
  D:   1000,
};


// Column index of each Amphipod's target room.
const TARGETS = {
  A: 3,
  B: 5,
  C: 7,
  D: 9,
};



function getBurrow(): string[][] {
  if (process.env.SOURCE == 'SMALL-B') {
    return SAMPLE_SMALL_B_UP;
  } else if (process.env.SOURCE == 'SMALL-MIX') {
    return SAMPLE_SMALL_AB_MIX;
  } else if (process.env.SOURCE == 'FULL') {
    return FULL_DATA;
  }
  return SAMPLE_DATA;
}


function day23_1(): void {
  console.log('Welcome to Day 23.1. Amphipod dance party.');

  const grid = getBurrow();

  const lowestCost = 0;
  console.log(`Found lowest cost (${lowestCost}).`);
}


day23_1();

