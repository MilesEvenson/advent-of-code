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


interface OverlapReport {
  beacons: Point[];
  primeFront?: Direction;
  primeSpot?: Point;
  primeUp?: Direction;
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
        { x: -2, y:  -3, z: 0 },  // B4
      ],
      id: 0,
    },

    {
      // Scanner 1 at  4,  1
      beacons: [
        { x: -2, y:   3, z: 0 },  // B1
        { x: -3, y:   1, z: 0 },  // B0
        { x:  1, y:  -3, z: 0 },  // B3
      ],
      id: 1,
    },

    {
      // Scanner 2 at  1, -3
      beacons: [
        { x:  4, y:   1, z: 0 },  // B3
        { x: -2, y:   3, z: 0 },  // B2
        { x: -3, y:   0, z: 0 },  // B4
      ],
      id: 2,
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


function point2Str(p: Point): string {
  return `[${p.x}, ${p.y}, ${p.z}]`;
}


function getFrontsForUp(up: Direction): Direction[] {
  // I'm sure there's a mathy way to do this,
  // but a switch is fine for now.
  switch (up) {
    case Direction.Xp:
      return [
        Direction.Yp,
        Direction.Zp,
        Direction.Yn,
        Direction.Zn,
      ];

    case Direction.Xn:
      return [
        Direction.Yp,
        Direction.Zn,
        Direction.Yn,
        Direction.Zp,
      ];

    case Direction.Yp:
      return [
        Direction.Zn,
        Direction.Xn,
        Direction.Zp,
        Direction.Xp,
      ];

    case Direction.Yn:
      return [
        Direction.Zp,
        Direction.Xn,
        Direction.Zn,
        Direction.Xp,
      ];

    case Direction.Zp:
      return [
        Direction.Yp,
        Direction.Xn,
        Direction.Yn,
        Direction.Xp,
      ];

    case Direction.Zn:
      return [
        Direction.Yn,
        Direction.Xn,
        Direction.Yp,
        Direction.Xp,
      ];
  }
}


function checkScannerOverlap(
  base: Scanner,
  prime: Scanner,
  threshold: number
): OverlapReport {
  const report: OverlapReport = {
    beacons: [],
  }

  // I am **ASSUMING** that there is only 1 front-up orientation
  // for prime that yields 12+ matching Beacon Points.

  //let allUps: Direction[] = [ ...Direction ];
  // For testing, default to a single up: Z-positive.
  let allUps: Direction[] = [ Direction.Zp ];

  let primeX = 0;
  let primeY = 0;
  let primeZ = 0;

  let offsetX = 0;
  let offsetY = 0;
  let offsetZ = 0;

  let isMatch = false;
  let matchPoints: Point[] = [];

  // for each of 6 up directions
  for (const up of allUps) {
    console.log(`\nChecking up (${up})`);
    // for each of 4 front directions (TODO: write this function)
    for (const front of getFrontsForUp(up)) {
      console.log(`  checking front (${front})`);

      // compare each base.beacon to each prime.beacon
      for (let br = 0; br < base.beacons.length; br++) {
        console.log(`    Reference Base:  ${point2Str(base.beacons[br])}`);

        for (let pr = 0; pr < prime.beacons.length; pr++) {
          matchPoints = [];

          // TODO:  Apply transform for the current up-front pair to the prime point...somehow
          // calc offset from prime reference beacon to base beacon
          offsetX = base.beacons[br].x - prime.beacons[pr].x;
          offsetY = base.beacons[br].y - prime.beacons[pr].y;
          offsetZ = base.beacons[br].z - prime.beacons[pr].z;

          console.log(`    Reference Prime Beacon: ${pr} ${point2Str(prime.beacons[pr])}.`);
          console.log(`    Offset: [${offsetX}, ${offsetY}, ${offsetZ}].`);

          for (let bc = 0; bc < base.beacons.length; bc++) {
            for (let pc = 0; pc < prime.beacons.length; pc++) {
              // TODO:  Apply transform for the current up-front pair to the prime point...somehow
              //        Get a map?
              primeX = prime.beacons[pc].x + offsetX;
              primeY = prime.beacons[pc].y + offsetY;
              primeZ = prime.beacons[pc].z + offsetZ;

              console.log(`      Checking Prime Beacon: ${pc} [${primeX}, ${primeY}, ${primeZ}] (raw: ${point2Str(prime.beacons[pc])}).`);

              isMatch = (
                base.beacons[bc].x == primeX
                && base.beacons[bc].y == primeY
                && base.beacons[bc].z == primeZ
              );
              if (isMatch) {
                console.log(`        +++ Match!`);
                // capture matching base beacon point
                matchPoints.push(base.beacons[bc]);
                if (threshold <= matchPoints.length) {
                  report.beacons = matchPoints;
                  // The offsets are the coordinates of the prime scanner.
                  report.primeSpot = {
                    x: offsetX,
                    y: offsetY,
                    z: offsetZ,
                  };
                  report.primeFront = front;
                  report.primeUp = up;
                  return report;
                }
              } // end - if isMatch
              else {
                console.log('        --- miss');
                console.log(`          ${base.beacons[bc].x} != ${primeX}`);
                console.log(`          ${base.beacons[bc].y} != ${primeY}`);
                console.log(`          ${base.beacons[bc].z} != ${primeZ}`);
              }

            } // end - prime beacon check loop
          } // end - base beacon check loop

        } // end - prime reference beacons loop
      } // end - base reference beacons loop

    } // end - fronts loop
  } // end - ups loop

  // Return empty/not-a-match report
  return report;
}


function identifyAllDistinctBeacons(scenario: Scenario): Point[] {
  const beacons: Point[][] = [];
  let report: OverlapReport;
  let totalMapped = 1;

  scenario.scanners[0].spot = { x: 0, y: 0, z: 0 };
  scenario.scanners[0].front = Direction.Yp;
  scenario.scanners[0].up = Direction.Zp;

  // TODO:  Compare each Scanner (prime) against Scanner0 (base).
  //        If overlap, define prime's front and up relative to base.

  for (let p = 1; p < scenario.scanners.length; p++) {
    console.log('\n=====================');
    console.log(`Will check scanners base ${scenario.scanners[0].id} against prime ${scenario.scanners[p].id}`);
    report = checkScannerOverlap(
      scenario.scanners[0],
      scenario.scanners[p],
      scenario.overlap
    );
    console.log(`Got report from comparing scanner ${scenario.scanners[p].id} to base scanner ${scenario.scanners[0].id}.`);
    console.dir(report, { depth: null, maxArrayLength: null });

    if (0 < report.beacons.length) {
      console.log('  Match!');
      scenario.scanners[p].front = report.primeFront;
      scenario.scanners[p].spot = report.primeSpot;
      scenario.scanners[p].up = report.primeUp;
      totalMapped++;
    }

    beacons.push(report.beacons);
  }

  console.dir(beacons, { depth: null, maxArrayLength: null });
  return beacons.flat(2);

  // TODO: track pairs of checked scanners for intelligent skipping below.

  while (totalMapped < scenario.scanners.length) {
    for (let b = 1; b < scenario.scanners.length; b++) {
      if (!scenario.scanners[b].spot) {
        // Skip Scanners that have not yet been discovered and oriented.
        continue;
      }

      for (let p = (b+1); p < scenario.scanners.length; p++) {
        // TODO: skip primes that have already been checked against this base.

        report = checkScannerOverlap(
          scenario.scanners[0],
          scenario.scanners[p],
          scenario.overlap
        );
        if (0 < report.beacons.length) {
          // TODO: update this point to be relative to origin, NOT current base.
          scenario.scanners[p].spot = report.primeSpot;
          // TODO: update these directions to be relative to origin, NOT current base.
          scenario.scanners[p].front = report.primeFront;
          scenario.scanners[p].up = report.primeUp;
          totalMapped++;
        }
        // TODO: update this Points to be relative to origin, NOT current base.
        beacons.push(report.beacons);
      }
    }
  } // end - while



  // TODO: flatten beacons

  return beacons.flat();
}




function day19_1(): void {
  console.log('Welcome to Day 19.1. Just trying to figure out which way is up.');

  const scenario = getScenario();
  console.dir(scenario, { depth: null, maxArrayLength: null });

  const beacons = identifyAllDistinctBeacons(scenario);
  console.log('\n\nFinal list of distinct beacons:');
  console.dir(beacons, { depth: null, maxArrayLength: null });

  const totalBeacons = beacons.length;
  console.log(`Found (${totalBeacons}) total beacons.`);
}


day19_1();

