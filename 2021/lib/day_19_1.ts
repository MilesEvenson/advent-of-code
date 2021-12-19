import * as fs from 'fs';
import path from 'path';


//
// Initial Thoughts:
//  I want to start with some small 2d scenarios to figure out
//  how to do the matching, then flatten the 3d sample to 2d
//  to check that logic on a larger dataset.
//  Then I'll move on to some small 3d scenarios, then do the
//  sample 3d dataset, then the FULL input.
//
//  Simplifying to 2d where both Scanners have the same front
//  (up: Zp, front: Yp) so a regular X,Y graph works.
//
//  Scanner S0 sees beacons B(a..d).
//  Scanner S1 sees beacons B(f..i).
//
//  How does matching work?
//  Beacons are fixed in space,
//  and x,y,z offsets are the same,
//  even if the labels are not.
//
//  How to "overlay" S1's Beacons onto S0's Beacons?
//    - Translate Bf Point to match Ba Point
//    - Iterate over Bg..Bi
//      - apply translation
//      - check matches through Bb..Bd
//
//  Working through small sample
//
//    S0 0,0    S1  4,1
//    Ba 1,2    Bf -3,0
//    Bb 2,4    Bg -2,3
//
//    | b           |
//    |           g |
//    |a            |
//    S____    __f__S
//
//    1)  Translate Bf to Ba
//        Translation: +4,+1
//
//    2)  Check other Beacons
//        Translate Bg
//          [-2,3] + [+4,+1]  =>  [2,4]
//        Check if matches Bb
//        success
//
//  What if the Ba-Bf translation does not yield any matches?
//  (e.g. translating Bf to Bb)
//  Translating each Beacon to each other beacon, then checking
//  each Beacon for matching coords, O(B^3), doesn't feel good,
//  but it's a tolerable way to start.
//  Also, I'd rather write this brute force implementation
//  that's easy to understand than burn time now grasping
//  for an optimization when I don't have any intuition.
//
//
//  Next step: add rotation
//  I think this is just transforming the Beacon coords
//  for each possible direction (initially 4 for 2d,
//  then 24 for 3d).
//  How does a rotation around an axis work?
//  Rotating counter-clockwise around Zp ("right hand rule"???)
//    Xp => Yp
//    Yp => Xn
//    Xn => Yn
//    Yn => Xp
//
//  Rotating counter-clockwise around Xn
//    Yp => Zp
//    Zp => Yn
//    Yn => Zn
//    Zn => Yp
//
//  Feels generalizable, but I won't get into that now.
//  
//  Will start coding
//
//
//
//
//



const C_RESET = '\x1b[0m';


enum Direction {
  Xp = 'Xp',
  Xn = 'Xn',

  Yp = 'Yp',
  Yn = 'Yn',

  Zp = 'Zp',
  Zn = 'Zn',
}


interface Point {
  x: number;
  y: number;
  z: number;
}


interface Scanner {
  beacons: Point[];
  id: number;

  // TODO: Is this field required for 19.1?
  front?: Direction;
  // TODO: Is this field required for 19.1?
  spot?: Point;
  // TODO: Is this field required for 19.1?
  up?: Direction;
}


interface Scenario {
  label: string;
  overlap: number;
  range: number;
  scanners: Scanner[];
}


// No rotation, all Scanners have { up: Zp, front: Yp }
// Each scanner sees a 9x9 square around itself.
// Find 
const SIMPLE_2D: Scenario = {

  label: 'Simple 2d with 3 scanners',
  overlap: 2,
  range: 4,
  scanners: [
    {
      // Scanner 0 at  0,  0
      beacons: [
        { x:  1, y:   2, z: 0 },  // B0
        { x:  2, y:   4, z: 0 },  // B1
        { x: -1, y:   0, z: 0 },  // B2
      ],
      front: Direction.Yp,
      id: 0,
      spot: { x: 0, y: 0, z: 0 },
      up: Direction.Zp,
    },

    {
      // Scanner 1 at  4,  1
      beacons: [
        { x: -2, y:   3, z: 0 },  // B1
        { x: -3, y:   1, z: 0 },  // B0
        { x:  1, y:  -3, z: 0 },  // B3
      ],
      front: Direction.Yp,
      id: 1,
      spot: { x: 4, y: 1, z: 0 },
      up: Direction.Zp,
    },

    {
      // Scanner 2 at  1, -3
      beacons: [
        { x:  4, y:   1, z: 0 },  // B3
        { x: -2, y:   3, z: 0 },  // B2
        { x: -2, y:  -2, z: 0 },  // B4
      ],
      front: Direction.Yp,
      id: 2,
      spot: { x: 1, y: -3, z: 0 },
      up: Direction.Zp,
    },
  ],
};


function loadFile(filename: string): Scenario {
  const buffInput = fs.readFileSync(path.join(__dirname, 'data', filename));
  const rawLines = buffInput.toString()
    .trim()
    .split('\n');

  let headerLine = rawLines.shift() as string;
  const [ _o, rawOverlap ] = headerLine.trim().split(' ');
  headerLine = rawLines.shift() as string;
  const [ _r, rawRange ] = headerLine.trim().split(' ');

  const scenario: Scenario = {
    label: filename,
    overlap: parseInt(rawOverlap, 10),
    range: parseInt(rawRange, 10),
    scanners: [],
  };

  let sc: Scanner;

  rawLines.forEach(line => {
    if (line.trim().indexOf('---') == 0) {
      const [
        _h,
        _s,
        strId,
        _t,
      ] = line.split(' ');
      sc = {
        beacons: [],
        id: parseInt(strId, 10),
        spot: { x: 0, y: 0, z: 0 },
      };
    } else if (line.trim().length == 0) {
      scenario.scanners.push(sc);
    } else {
      const [ strX, strY, strZ ] = line.trim().split(',');
      sc.beacons.push({
        x: parseInt(strX, 10),
        y: parseInt(strY, 10),
        z: parseInt(strZ, 10),
      });
    }
  });

  return scenario;
}


function getScenario(): Scenario {
  switch (process.env.SOURCE) {
    case 'SIMPLE_2D':
      return SIMPLE_2D;
    case 'FULL':
      return loadFile('day_19.input.txt');
  }

  return SIMPLE_2D;
}







function day19_1(): void {
  console.log('Welcome to Day 19.1. Just trying to figure out which way is up.');

  const scenario = getScenario();
  console.dir(scenario, { depth: null, maxArrayLength: null });

  const totalBeacons = 0;
  console.log(`Found (${totalBeacons}) total beacons.`);
}


day19_1();

