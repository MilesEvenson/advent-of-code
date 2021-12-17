//
// First attempt:
//  What arithmatic can I do as part of this calculation?
//  Total x distance is ( x + (x-1) + (x-2) + ... ) until x == 0.
//  Total y distance is technically unbounded,
//  but practically the lower bound is the bottom of
//  the target area (-5 and -88 in my case).
//  At every step s, the y velocity is y-s until (y < targetBottom).
//  What does this mean for the arc?
//  vY decreases to zero on the way up, then accelerates on the way down
//  and at y == 0 vY is 'back' to the initial vY.
//  Below 0, |vY| contines increasing.
//  So maxY is similar to maxX, the "initial vY"-th triangular number.
//
//  How do I use this?
//    - understand which trajectories land in target
//    - take trajectory with highest Y
//
//  Find candidate values for vX0?
//  Calc triangular numbers until (targetRight < sum)
//
//  Find candidate values for vY0?
//  A little more complex than vX.
//  Both SAMPLE and FULL targets have negative Y values.
//  So calculate triangular numbers with an offset.
//  T(vY0) - T(s)
//
//  Outline:
//    - Generate possible vX0 and vY0 values.
//    - Simulate the trajectory for each pair to find
//      which [ vX0, vY0] pairs hit the target.
//      - O(countX * countY)
//    - Iterate over winning trajectories to find maxY.
//      - O(countX * countY) in the worst case.
//
//
//  My initial thinking was incomplete for calculating
//  valid values for vX0.
//  Initially, I only considered this scenario:
//    targetLeft <= xFinal <= targetRight
//
//  But I don't only care ub xFinal.
//  ALL of the discrete X values in the target area are valid.
//  So I should count down from step = targetRight ... somehow.
//  Obviously, the all first steps can work with the matching
//  vY0 value (aka - shoot directly at target to hit on first step).
//
//  Can I quickly derive a formula for the "head" of the triangular number?
//  E.g. for vX0 = 9, flying step 4 hits (flying step zero is at the origin).
//  T(9) => 45
//  T(9-4) => 15
//  T(9) - T(9-4) => 30 (the hit)
//
//
//  After a healthy amount of muddled debugging,
//  still haven't found the correct answer.
//  There are a couple ways to group positive values for vY0
//
//    Super High    The first fallingStep (first below 0)
//                  puts a hit in the target area.
//                  These are easy to calculate
//                  because (vY0+1) is in the set { top .. bottom }.
//
//    Mid-Range     There are multiple fallingSteps below 0.
//                  This is every value vY0 <= |bottom| / 2
//                  (values closer to bottom will overshoot)
//
//    Update getCandidateYValues() to use this logic!
//
//
// Complexity Analysis:
//
//  Time Complexity:
//
//  Space complexity:
//
//
//
//
//


const C_RESET = '\x1b[0m';


const START_X = 0;
const START_Y = 0;

// 'target area: x=20..30, y=-10..-5';
const SAMPLE_TARGET = {
            top: -5,
  left: 20,               right: 30,
            bottom: -10,
};

// 'target area: x=128..160, y=-142..-88';
const FULL_TARGET = {
              top: -88,
  left: 128,                right: 160,
              bottom: -142,
};


interface FiringSolution {
  hitX: number;
  hitY: number;
  initialX: number;
  initialY: number;
  trajectory: number[][];
}


function isFull(): boolean {
  return (process.env.SOURCE === 'FULL');
}


function T(step: number): number {
  if (step <= 0) {
    return 0;
  }
  return (step * (step + 1)) / 2;
}


function getCandidateXValues(targetLeft: number, targetRight: number): Record<number, number> {
  //console.log(`Collecting candidate X values for target range (${targetLeft}..${targetRight})`);

  const values: Record<number, number> = {};

  // Collect vX0 values such that xFinal is in the target area.
  let vX0 = 1;
  let xFinal = 1;
  do {
    xFinal = T(vX0);
    if (targetLeft <= xFinal && xFinal <= targetRight) {
      values[vX0] = vX0;
    }
    vX0++;
  } while (T(vX0) <= targetRight);

  // Collect vX0 values where a mid-range step is in the target area.
  let flyingStep = 1;
  let xFlying = 0;
  do {
    flyingStep = 1;
    do {
      xFlying = T(vX0) - T(vX0 - flyingStep);
      //console.log(`  at (${vX0}, ${flyingStep}) xFlying (${xFlying})`);
      if (targetLeft <= xFlying && xFlying <= targetRight) {
        values[vX0] = flyingStep;
      }
      flyingStep++;
    } while (xFlying <= targetRight);
    vX0++;
  } while ((2 * vX0 - 1) <= targetRight);

  // Collect vX0 values such that x1 is in the target area.
  // AKA - shots directly at the target.
  for (let vXDirect = targetLeft; vXDirect <= targetRight; vXDirect++) {
        values[vXDirect] = 1;
  }

  return values;
}


function getCandidateYValues(targetTop: number, targetBottom: number): Record<number, number> {
  //console.log(`Collecting candidate Y values for target range (${targetTop}..${targetBottom})`);
  const values: Record<number, number> = {};
  let fallingStep = 0;
  let vY0 = 0;
  let maxY = 0;
  let yFalling = 0;

  // Live dangerously and assume the maxY for the FULL target won't be negative.
  // TODO: Verify this can handle negative values for vY0 (aka - direct shot at target)

  do {
    if (vY0 <= 0) {
      maxY = 0;
      fallingStep = 0;
    } else {
      maxY = T(vY0);
      fallingStep = vY0 + 1;
    }
    //console.log(`  vY0 (${vY0}) with maxY (${maxY})`);
    do {
      yFalling = maxY - T(fallingStep);
      //console.log(`  yFalling (${yFalling} <= ${maxY} - ${T(fallingStep)}) at falling step (${fallingStep})`);
      fallingStep++;
    } while (targetTop < yFalling);
    if (yFalling <= targetTop && targetBottom <= yFalling) {
      if (vY0 <= 0) { 
        values[vY0] = fallingStep;
      } else {
        values[vY0] = vY0 + fallingStep;
      }
    }
    vY0++;
  } while (targetBottom <= yFalling);

  return values;
}


function findHitWithMaxY(
  xValues: Record<number, number>,
  yValues: Record<number, number>,
  targetLeft: number,
  targetRight: number
): number {
  let isHit = false;
  let xStalled = false;
  let maxY = 0;
  let intVX0 = 0;
  let intVY0 = 0;

  for (const vX0 in xValues) {
    intVX0 = parseInt(vX0, 10);
    console.log(`  Checking vX0 (${vX0}, ${intVX0}) with maxX (${T(intVX0)}).`);
    xStalled = (targetLeft <= T(intVX0) && T(intVX0) <= targetRight);

    if (targetLeft <= T(intVX0)) {
      console.log(`        maxX to the right of targetLeft (${targetLeft} <= ${T(intVX0)})`);
    } else {
      console.log(`        maxX less than targetLeft (${T(intVX0)} <= ${targetLeft})`);
    }


    if (T(intVX0) <= targetRight) {
      console.log(`        maxX to the left of targetRight (${T(intVX0)} <= ${targetRight})`);
    } else {
      console.log(`        maxX greater than targetRight (${targetLeft} <= ${T(intVX0)})`);
    }

    if (xStalled) {
      console.log(`    vX0 (${vX0}) stalls at (${T(intVX0)}) after (${xValues[vX0]}) steps.`);
    } else {
      console.log(`    no stall for vX0 (${vX0}).`);
    }

    for (const vY0 in yValues) {
      intVY0 = parseInt(vY0, 10);
      isHit = false;

      if (xValues[vX0] == yValues[vY0]) {
        isHit= true;
      } else if (xStalled && xValues[vX0] <= yValues[vY0]) {
        isHit= true;
      }

      if (isHit) {
        console.log(`      Hit for (${vX0}, ${vY0})`);
        if (maxY < T(intVY0)) {
            maxY = T(intVY0);
        }
      }

    }
  }

  return maxY;
}


function day17_1(): void {
  console.log('Welcome to Day 17.1. May your probes fly high.');

  let target = SAMPLE_TARGET;

  if (isFull()) {
    console.log('Aiming at the FULL target.');
    target = FULL_TARGET;
  } else {
    console.log('Aiming at the SAMPLE target.');
  }

  const candidateX = getCandidateXValues(target.left, target.right);
  const candidateY = getCandidateYValues(target.top, target.bottom);
  console.dir(candidateX);
  console.dir(candidateY);

  // 2415   low
  // 2346   low

  const maxY = findHitWithMaxY(candidateX, candidateY, target.left, target.right);
  console.log(`Found maxY (${maxY}).`);

}


day17_1();

