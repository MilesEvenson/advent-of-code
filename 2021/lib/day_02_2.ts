import RawInstructions from './data/day_2.input';


//
// First attempt:
//  Simply added a new field to the Position interface,
//  and updated the logic for processing an instruction
// Time complexity:   O(N)
// Space complexity:  O(N)
//
//
// Total time: 4 minutes
//  
//


enum Direction {
  Down = 'down',
  Forward = 'forward',
  Up = 'up',
}


interface Instruction {
  direction: Direction;
  distance: number;
}


interface Position {
  aim: number;
  depth: number;
  horizontal: number;
};


const SAMPLE_DATA: string[] = [
  'forward 5',
  'down 5',
  'forward 8',
  'up 3',
  'down 8',
  'forward 2',
];


function loadData(): string[] {
  //return SAMPLE_DATA;
  return RawInstructions;
}


function parseInstruction(rawLine: string): Instruction {
  const [
    rawDir,
    rawDist,
  ] = rawLine.trim().toLowerCase().split(/\s+/);
  return {
    direction: rawDir as Direction,
    distance: parseInt(rawDist, 10),
  } as Instruction;
}


function getInstructions(): Instruction[] {
  // Assume that our data is well formatted:
  //  - each line has a direction and a distance
  //  - all directions are valid (down, forward, up)
  //  - no empty lines
  const rawLines = loadData();
  return rawLines.map(parseInstruction);
}


function moveSub(instructions: Instruction[]): Position {
  return instructions.reduce(
    (pos: Position, inst: Instruction): Position => {
      switch (inst.direction) {
        case Direction.Down:
          pos.aim += inst.distance;
          break;
        case Direction.Forward:
          pos.depth += (pos.aim * inst.distance);
          pos.horizontal += inst.distance;
          break;
        case Direction.Up:
          pos.aim -= inst.distance;
          break;
        default:
          console.error(`Unknown direction: (${inst.direction})`);
      }
      return pos;
    },
    {
      aim: 0,
      depth: 0,
      horizontal: 0,
    } as Position
  );
}


function day2_1(): void {
  console.log('Welcome to Day 2.1');
  const instructions = getInstructions();
  const {
    depth,
    horizontal,
  } = moveSub(instructions);
  const product = horizontal * depth;
  console.log(`The sub is at H (${horizontal}), D (${depth}), with a product of (${product}).`);
}


day2_1();

