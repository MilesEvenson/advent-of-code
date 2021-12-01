import DepthMeasurements from './day_1_1.input';


//
// First attempt:
//  Walk the list twice. This is blind premature optimization,
//  guessing that problem 1.2 cares about the measurements.
//  It would be easy to keep a count of depth increases during
//  the first pass over the list of measurements.
// Time complexity:   O(N)
// Space complexity:  O(N)
//
// Total time: ~30 minutes
//  Includes some time spent stumbling through Node and TypeScript details.
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


function countDepthIncreases(scanReport: number[]): number {
  if (scanReport.length === 0) {
    return 0;
  }
  
  let prevDepth: number = scanReport[0];
  const deltas: string[] = ['N/A - no previous measurement'];

  for (let i = 1; i < scanReport.length; i++) {
    if (prevDepth < scanReport[i]) {
      deltas.push('increased');
    } else if (scanReport[i] < prevDepth) {
      deltas.push('decreased');
    } else {
      deltas.push('same');
    }
    prevDepth = scanReport[i];
  }

  const countIncreased = deltas.reduce(
    (sum, delta): number => {
      if (delta === 'increased') {
        return (sum + 1);
      }
      return sum;
    },
    0
  );

  return countIncreased;
}


function day1_1(): void {
  console.log('Welcome to Day 1.1');
  const depthMeasurements = getDepths();
  const count = countDepthIncreases(depthMeasurements);
  console.log(`The depth increased ${count} times.`);
}


day1_1();

