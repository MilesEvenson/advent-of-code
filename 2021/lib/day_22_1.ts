import * as fs from 'fs';
import path from 'path';


//
// Initial Thoughts:
//  Brute force:
//    - execute all P ops
//    - traverse all C cubes to count how many are on
//
//  Can I quickly think of another approach?
//  Generate a key 'x-y-z' for each cube in the 50x50x50 space.
//  Then find the last op touching that cube.
//  That is its final state.
//  I don't need the first step.
//  Checking "last op on cube" is O(P)
//  I'll try to write it quickly.
//  --> WORKS
//
//
// Reflections:
//  Glad it works as expected.
//  Not feeling optimistic with the huge ranges in both
//  the MEDIUM and FULL inputs.
//
//
//



const C_RESET = '\x1b[0m';



const SAMPLE_STEPS_SMALL = [
  'on x=10..12,y=10..12,z=10..12',
  'on x=11..13,y=11..13,z=11..13',
  'off x=9..11,y=9..11,z=9..11',
  'on x=10..10,y=10..10,z=10..10',
];


const SAMPLE_STEPS_MEDIUM = [
  'on x=-20..26,y=-36..17,z=-47..7',
  'on x=-20..33,y=-21..23,z=-26..28',
  'on x=-22..28,y=-29..23,z=-38..16',
  'on x=-46..7,y=-6..46,z=-50..-1',
  'on x=-49..1,y=-3..46,z=-24..28',
  'on x=2..47,y=-22..22,z=-23..27',
  'on x=-27..23,y=-28..26,z=-21..29',
  'on x=-39..5,y=-6..47,z=-3..44',
  'on x=-30..21,y=-8..43,z=-13..34',
  'on x=-22..26,y=-27..20,z=-29..19',
  'off x=-48..-32,y=26..41,z=-47..-37',
  'on x=-12..35,y=6..50,z=-50..-2',
  'off x=-48..-32,y=-32..-16,z=-15..-5',
  'on x=-18..26,y=-33..15,z=-7..46',
  'off x=-40..-22,y=-38..-28,z=23..41',
  'on x=-16..35,y=-41..10,z=-47..6',
  'off x=-32..-23,y=11..30,z=-14..3',
  'on x=-49..-5,y=-3..45,z=-29..18',
  'off x=18..30,y=-20..-8,z=-3..13',
  'on x=-41..9,y=-7..43,z=-33..15',
  'on x=-54112..-39298,y=-85059..-49293,z=-27449..7877',
  'on x=967..23432,y=45373..81175,z=27513..53682',
];


enum Status {
  OFF = 'off',
  ON  = 'on',
}


interface Op {
  status: Status,
  keys: string[],
}


function rangeFromChunk(chunk: string): number[] {
  const [ strStart, strEnd ] = chunk.split('..');
  const start = parseInt(strStart, 10);
  const end = parseInt(strEnd, 10);
  const range: number[] = [];
  console.warn('TODO: smarter filtering logic?');
  if (-50 <= start && end <= 50) {
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
  }
  return range;
}


function parseLine(raw: string): Op {
  const chunks = raw.split(',');
  const [ status, xChunk ] = chunks[0].split(' ');
  const rangeX = rangeFromChunk(xChunk.substring(2));
  const rangeY = rangeFromChunk(chunks[1].substring(2));
  const rangeZ = rangeFromChunk(chunks[2].substring(2));
  const keys: string[] = [];
  for (let x = 0; x < rangeX.length; x++) {
    for (let y = 0; y < rangeY.length; y++) {
      for (let z = 0; z < rangeZ.length; z++) {
        keys.push(`${rangeX[x]}-${rangeY[y]}-${rangeZ[z]}`);
      }
    }
  }
  return {
    status: status as Status,
    keys: keys,
  };
}


function getSteps(): Op[] {
  let rawLines = SAMPLE_STEPS_SMALL;
  if (process.env.SOURCE == 'MEDIUM') {
    rawLines = SAMPLE_STEPS_MEDIUM;
  } else if (process.env.SOURCE == 'FULL') {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data', 'day_22.input.txt'));
    rawLines = buffInput.toString()
      .trim()
      .split('\n');
  }
  return rawLines.map(parseLine);
}


function day22_1(): void {
  console.log('Welcome to Day 22.1. Core Reboot.');

  const allSteps = getSteps();
  //console.dir(allSteps, { depth: null, maxArrayLength: null });

  const cubes: Record<string, Status> = {};
  let totalCubesOn = 0;

  for (let i = allSteps.length-1; 0 <= i; i--) {
    console.log(`\nStep ${i}`);
    allSteps[i].keys.forEach(k => {
      if (!cubes.hasOwnProperty(k)) {
        console.log(`  cube (${k}) last seen set to ${allSteps[i].status}`);
        cubes[k] = allSteps[i].status;
        if (allSteps[i].status == Status.ON) {
          totalCubesOn++;
        }
      }
      //else { console.log(`Cube (${k}) already has status (${cubes[k]})`); }
    });
  }

  console.log(`Found (${totalCubesOn}) total on cubes.`);
}


day22_1();

