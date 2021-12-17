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
  initialX: number;
  initialY: number;
  trajectory: number[][];
}


function isFull(): boolean {
  return (process.env.SOURCE === 'FULL');
}


function T(step: number): number {
  return (step * (step + 1)) / 2;
}


function getCandidateXValues(targetLeft: number, targetRight: number): Record<number, number> {
  console.log(`Collecting candidate X values for target range (${targetLeft}..${targetRight})`);

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
  // TODO: expensive calculations to get mid-range hits.

  // xFlying = T(vX0) - T(vX0 - flyingStep)
  // if xFlying < left
  //  undershot, flyingStep++
  // else if left <= xFlying <= right
  //  hit, count it
  // else
  //  overshot, break

  let flyingStep = 1;
  let xFlying = 0;
  do {
    flyingStep = 1;
    do {
      xFlying = T(vX0) - T(vX0 - flyingStep);
      console.log(`  at (${vX0}, ${flyingStep}) xFlying (${xFlying})`);
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
  console.log(`Collecting candidate Y values for target range (${targetTop}..${targetBottom})`);
  const values: Record<number, number> = {};
  let fallingStep = 0;
  let vY0 = 0;
  let maxY = 0;
  let yFalling = 0;

  // Live dangerously and assume the maxY for the FULL target won't be negative.
  // TODO: Verify this can handle negative values for vY0 (aka - direct shot at target)

  do {
    maxY = T(yV0);
    console.log(`  vY0 (${vY0}) with maxY (${maxY})`);
    fallingStep = step + 1;
    do {
      yFalling = vY0 - T(fallingStep);
      console.log(`  yFalling (${yFalling}) at falling step (${fallingStep})`);
      fallingStep++;
    } while (targetTop < yFalling);
    if (yFalling <= targetTop && targetBottom <= yFalling) {
      values[vY0] = fallingStep + step;
    }
    vY0++;
  } while (targetBottom <= yFalling);

  return values;
}


function generateTrajectories(
  xValues: Record<number, number>,
  yValues: Record<number, number>
): number[][] {
  const trajectories: number[][] = [];

  for (const vX0 in xValues) {
    for (const vY0 in yValues) {
      // do a smart check
    }
  }

  return trajectories;
}


function day17_1(): void {
  console.log('Welcome to Day 17.1. May your probes fly high.');

  if (isFull()) {
    console.log('TODO: load full data');
  } else {
    const candidateX = getCandidateXValues(SAMPLE_TARGET.left, SAMPLE_TARGET.right);
    console.dir(candidateX);
    const candidateY = getCandidateYValues(SAMPLE_TARGET.top, SAMPLE_TARGET.bottom);
    console.dir(candidateY);
  }

}


day17_1();

