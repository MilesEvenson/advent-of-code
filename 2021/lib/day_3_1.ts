import RawDiagnostic from './day_3.input';


//
// First attempt:
//  Check least-significant bit in each number,
//  update counts for that position,
//  then shift right.
// Time complexity:   O(N)
// Space complexity:  O(N)
//
//
// Total time: ~50 minutes
//  
//




const SAMPLE_DATA: string[] = [
  '00100',
  '11110',
  '10110',
  '10111',
  '10101',
  '01111',
  '00111',
  '11100',
  '10000',
  '11001',
  '00010',
  '01010',
];


interface Rates {
  epsilon: number;
  gamma: number;
}


function loadData(): string[] {
  //return SAMPLE_DATA;
  return RawDiagnostic;
}


function parseNumber(strNum: string): number {
  return parseInt(strNum, 2);
}


function getDiagnostic(): number[] {
  const rawData = loadData();
  return rawData.map(parseNumber);
}


function countDiagnosticBits(numbers: number[]): number[][] {
  // Find the largest number in the set so I
  // know how many places I'll be counting.
  const maxNum = numbers.reduce((max, n) => ((max < n) ? n : max), 0);
  const exp = Math.ceil(Math.log2(maxNum));
  // Store bit counts in "reverse" order:
  // least-significant bit in "leftmost" index 0.
  // This makes looping a little simpler.
  const counts: number[][] = [];
  for (let i = 0; i < exp; i++) {
    counts.push([0, 0]);
  }

  // Iterate over diagnostic numbers to get most common value for each place.
  // For each number
  //  - check lsb
  //  - increment counter
  //  - shift right 1

  numbers.forEach((num: number): void => {
    //console.log(`Will process (${(num).toString(2)})`);
    let lsb = 0;
    for (let i = 0; i < counts.length; i++) {
      lsb = num & 1;
      //console.log(`  bit ${i} is (${lsb})`);
      counts[i][lsb]++;
      num = num >> 1;
    }
  });

  return counts;
}


function analyzeCounts(counts: number[][]): Rates {
  const rates = counts.reduce(
    (rates: Rates, placeCounts: number[], idx: number): Rates => {
      let leastCommon = 0;
      let mostCommon = 0;
      if (placeCounts[0] < placeCounts[1]) {
        rates.gamma += Math.pow(2, idx);
      } else if (placeCounts[1] < placeCounts[0]) {
        rates.epsilon += Math.pow(2, idx);
      } else {
        console.warn(`Identical place counts for idx (${idx}).`);
      }
      return rates;
    },
    {
      epsilon: 0,
      gamma: 0,
    } as Rates
  );

  return rates;
}



function day3_1(): void {
  console.log('Welcome to Day 3.1');
  const diagnostic = getDiagnostic();
  const bitCounts = countDiagnosticBits(diagnostic);
  //console.dir(bitCounts, { depth: null, maxArrayLength: null });
  const rates = analyzeCounts(bitCounts);
  //console.dir(rates, { depth: null, maxArrayLength: null });
  const product = rates.epsilon * rates.gamma;
  console.log(`Epsilon (${rates.epsilon}) * Gamma (${rates.gamma}) => ${product}`);
}


day3_1();

