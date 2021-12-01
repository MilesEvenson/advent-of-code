import DepthMeasurements from './day_1_2.input';


//
// First attempt:
//  Walk the list twice:
//    - transform to deltas using a sliding window
//    - count deltas (same as previous step)
//  I think it would be reasonable to break out the sliding
//  window step to a separate function, but this is fine.
//  I also think it would be interesting to process the depths
//  as a stream, but don't care enough right now to code up
//  a second, stream-based solution.
// Time complexity:   O(N)
// Space complexity:  O(N)
//
// Total time:  ~20 minutes
//  Subtracting distractions
//


const SAMPLE_DATA: number[] = [
  199,
  200,
  208,
  210,
  200,
  207,
  240,
  269,
  260,
  263,
];


function getDepths(): number[] {
  //return SAMPLE_DATA;
  return DepthMeasurements;
}


function processMeasurements(scanReport: number[]): string[] {
  if (scanReport.length < 3) {
    return [];
  }

  // Is Rabin-Karp appropriate here?
  // I need to know the max number of depth values, so maybe not?
  // Fine!
  // I'll do a regular sliding window :(

  let prevDepth = scanReport[0] + scanReport[1] + scanReport[2];
  const deltas: string[] = ['N/A - no previous measurement'];

  for (let i = 3; i < scanReport.length; i++) {
    if (prevDepth < (scanReport[i-2] + scanReport[i-1] + scanReport[i])) {
      deltas.push('increased');
    } else if ((scanReport[i-2] + scanReport[i-1] + scanReport[i]) < prevDepth) {
      deltas.push('decreased');
    } else {
      deltas.push('same');
    }
    prevDepth = prevDepth - scanReport[i-3] + scanReport[i];
  }

  return deltas;
}


function countDepthIncreases(deltas: string[]): number {
  const countIncreased = deltas.reduce(
    (sum, d): number => {
      if (d === 'increased') {
        return (sum + 1);
      }
      return sum;
    },
    0
  );
  return countIncreased;
}


function day1_2(): void {
  console.log('Welcome to Day 1.2');
  const depthMeasurements = getDepths();
  const deltas = processMeasurements(depthMeasurements);
  const count = countDepthIncreases(deltas);
  console.log(`The depth increased ${count} times.`);
}


day1_2();

