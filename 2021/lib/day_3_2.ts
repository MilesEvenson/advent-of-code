import RawDiagnostic from './day_3.input';


//
// First attempt:
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
//    Full input data:  O(R*L)
//    Trie:             O(2^(L+1) - 1)
//                      (Worst case is a full binary tree of depth L)
//
// Total time: 120 minutes
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
  depth: number;
  value: string;
};


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


function buildTrie(rawLines: string[]): Trie {
  const root: Trie = {
    zeroes: null,
    ones: null,
    countChildren: 0,
    depth: -1,
    value: '',
  };

  return rawLines.reduce(
    (trie: Trie, line: string): Trie => {
      console.log(`Processing line: ${line}`);
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
              depth: node.depth + 1,
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
              depth: node.depth + 1,
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


function calculateGeneratorRatings(root: Trie): number {
  const digits: string[] = [];
  let node: Trie | null = root;
  let countZeroes = 0;
  let countOnes = 0;

  while (node) {
    digits.push(node.value);
    console.log('processing node:');
    console.dir(node, { depth: 0 });
    countZeroes = 0;
    countOnes = 0;
    if (node.zeroes) {
      countZeroes = node.zeroes.countChildren ?? 0;
    }
    if (node.ones) {
      countOnes = node.ones.countChildren ?? 0;
    }

    if (!node.zeroes) {
      console.log('Current node does not have child zeroes, move to ONE branch');
      node = node.ones;
    } else if (!node.ones) {
      console.log('Current node does not have child ones, move to ZERO branch');
      node = node.zeroes;
    } else if (countZeroes <= countOnes) {
      console.log(`${countZeroes}(0) <= ${countOnes}(1), moving to ONE branch`);
      node = node.ones;
    } else if (countOnes < countZeroes) {
      console.log(`${countOnes}(1) < ${countZeroes}(0), moving to ZERO branch`);
      node = node.zeroes;
    } else {
      console.warn('Entered a bad state', {node, digits});
    }
  }

  console.log('Build digit array:', digits);

  return parseInt(digits.join(''), 2);
}


// TODO:  Consider abstracting the comparison logic so I can
//        have one generic version of this function.
function calculateScrubberRatings(root: Trie): number {
  const digits: string[] = [];
  let node: Trie | null = root;
  let countZeroes = 0;
  let countOnes = 0;

  while (node) {
    digits.push(node.value);
    console.log('processing node:');
    console.dir(node, { depth: 0 });
    countZeroes = 0;
    countOnes = 0;
    if (node.zeroes) {
      countZeroes = node.zeroes.countChildren ?? 0;
    }
    if (node.ones) {
      countOnes = node.ones.countChildren ?? 0;
    }

    if (!node.zeroes) {
      console.log('Current node does not have child zeroes, move to ONE branch');
      node = node.ones;
    } else if (!node.ones) {
      console.log('Current node does not have child ones, move to ZERO branch');
      node = node.zeroes;
    } else if (countZeroes <= countOnes) {
      console.log(`${countZeroes}(0) < ${countOnes}(1), moving to ZERO branch`);
      node = node.zeroes;
    } else if (countOnes < countZeroes) {
      console.log(`${countOnes}(1) <= ${countZeroes}(0), moving to ONE branch`);
      node = node.ones;
    } else {
      console.warn('Entered a bad state', {node, digits});
    }
  }

  console.log('Build digit array:', digits);

  return parseInt(digits.join(''), 2);
}


function day3_2(): void {
  console.log('Welcome to Day 3.2. Today is trie day!');
  const rawLines = loadData();
  const trie = buildTrie(rawLines);
  console.dir(trie, { depth: null });
  console.log('Calculating Oxygen Generator rating');
  const generatorRating = calculateGeneratorRatings(trie);
  console.log('Calculating CO2 Scrubber rating');
  const scrubberRating = calculateScrubberRatings(trie);
  const product = scrubberRating * generatorRating;
  console.log(`CO2 Scrubber (${scrubberRating}) * O2 Gen (${generatorRating}) => ${product}`);
}


day3_2();

