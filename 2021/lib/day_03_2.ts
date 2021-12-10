import RawDiagnostic from './data/day_3.input';


//
// First attempt:
//  Build a trie of binary strings,
//  then execute a separate function for each type of rating
//  to traverse to the bottom of the trie, building a string
//  of binary digits.
//
// Second attempt:
//  Same high-level plan, but break out rating-specific logic
//  into separate functions that can be passed to a generic
//  calculateRating() traversal function. Having done it,
//  I like how the rating-specific logic is clearly labeled,
//  but defining 2 functions for each rating type is arguably
//  too verbose for a one-off script like this.
//
// Complexity Analysis:
//    R: number of rows
//    L: char length of each row
//
//  Time Complexity:
//    Build Trie:     O(R*L)
//    Calc Ratings:   O(2L)
//
// Space complexity:
//    Complete input data:  O(R*L)
//    Trie:                 O(2^(L+1) - 1)
//                          (Worst case is a full binary tree of depth L)
//
// Total time: ~155 minutes
//  First attempt:    120 minutes
//  Second attempt:   ~35 minutes
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


const ZERO = '0';
const ONE = '1';


interface Trie {
  zeroes: Trie | null;
  ones: Trie | null;
  countChildren: number;
  value: string;
};


function loadData(): string[] {
  //return SAMPLE_DATA;
  return RawDiagnostic;
}


function buildTrie(rawLines: string[]): Trie {
  const root: Trie = {
    zeroes: null,
    ones: null,
    countChildren: 0,
    value: '',
  };

  return rawLines.reduce(
    (trie: Trie, line: string): Trie => {
      //console.log(`Processing line: ${line}`);
      let nextDigit = '';
      let node = trie;

      for (let c = 0; c < line.length; c++) {
        nextDigit = line[c];

        node.countChildren++;
        if (nextDigit === ZERO) {
          if (!node.zeroes) {
            node.zeroes = {
              zeroes: null,
              ones: null,
              countChildren: 0,
              value: ZERO
            } as Trie;
          }
          node = node.zeroes;
        } else if (nextDigit === ONE) {
          if (!node.ones) {
            node.ones = {
              zeroes: null,
              ones: null,
              countChildren: 0,
              value: ONE
            } as Trie;
          }
          node = node.ones;
        } else {
          console.warn(`Unknown Digit: (${nextDigit})`);
        }

      } // End line loop

      return trie;
    },
    root
  );
}


function generatorShouldGetZeroes(
  node: Trie,
  countZeroes: number,
  countOnes: number,
): boolean {
  let shouldGetZeroes = false;

  if (!node.ones) {
    shouldGetZeroes = true;
  } else if (node.zeroes && countOnes < countZeroes) {
    shouldGetZeroes = true;
  }

  return shouldGetZeroes;
}


function generatorShouldGetOnes(
  node: Trie,
  countZeroes: number,
  countOnes: number,
): boolean {
  let shouldGetOnes = false;

  if (!node.zeroes) {
    shouldGetOnes = true;
  } else if (node.ones && countZeroes <= countOnes) {
    shouldGetOnes = true;
  }

  return shouldGetOnes;
}


function scrubberShouldGetZeroes(
  node: Trie,
  countZeroes: number,
  countOnes: number,
): boolean {
  let shouldGetZeroes = false;

  if (!node.ones) {
    shouldGetZeroes = true;
  } else if (node.zeroes && countZeroes <= countOnes) {
    shouldGetZeroes = true;
  }

  return shouldGetZeroes;
}


function scrubberShouldGetOnes(
  node: Trie,
  countZeroes: number,
  countOnes: number,
): boolean {
  let shouldGetOnes = false;

  if (!node.zeroes) {
    shouldGetOnes = true;
  } else if (node.ones && countOnes < countZeroes) {
    shouldGetOnes = true;
  }

  return shouldGetOnes;
}


function calculateRating(
  root: Trie,
  shouldGetZeroes: (a: Trie, b: number, c: number) => boolean,
  shouldGetOnes: (a: Trie, b: number, c: number) => boolean,
): number {
  const digits: string[] = [];
  let node: Trie | null = root;
  let countZeroes = 0;
  let countOnes = 0;

  while (node) {
    digits.push(node.value);

    countZeroes = node.zeroes?.countChildren ?? 0;
    countOnes = node.ones?.countChildren ?? 0;

    if (shouldGetZeroes(node, countZeroes, countOnes)) {
      node = node.zeroes;
    } else if (shouldGetOnes(node, countZeroes, countOnes)) {
      node = node.ones;
    } else {
      //console.warn('Done with loop');
      break;
    }

  }

  return parseInt(digits.join(''), 2);
}


function day3_2(): void {
  console.log('Welcome to Day 3.2. Today is trie day!');

  const rawLines = loadData();
  const trie = buildTrie(rawLines);

  //console.log('Calculating Oxygen Generator rating');
  const generatorRating = calculateRating(
    trie,
    generatorShouldGetZeroes,
    generatorShouldGetOnes
  );

  //console.log('Calculating CO2 Scrubber rating');
  const scrubberRating = calculateRating(
    trie,
    scrubberShouldGetZeroes,
    scrubberShouldGetOnes
  );

  const product = scrubberRating * generatorRating;
  console.log(`O2 Gen (${generatorRating}) * CO2 Scrubber (${scrubberRating}) => ${product}`);
}


day3_2();

