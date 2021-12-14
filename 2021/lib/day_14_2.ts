import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  Overview below in day14_2()
//
//  Must get faster at implementation after planning,
//  ideally in a way that reduces problems that trigger
//  extensive debugging.
//
//
//  Total ops:
//    with memo:    5939
//    no memo:       ???
//  Got 'Maximum call stack size exceeded' without the memo.
//
// Complexity Analysis:
//  S: total steps
//  C: number of distinct characters ('elements' in the prompt)
//  I: number of distinct instructions
//
//  Time Complexity:
//    O(S * I)
//    Initially, calculate the counts for each instruction at each depth,
//    then process outstanding instructions.
//    
//
//  Space complexity:
//    O(S * I * C)
//    Store a count for each distinct element for each instruction for each depth.
//
//
// Total time,   ~210   minutes
//  Planning       70
//  Programming    50
//  Debugging      90
//
//  Missing off-by-one ops caused me to spend a fair amount
//  of time re-re-re-reviewing core traversal logic when
//  I should have taken a minute to think through the algo,
//  and where I would need to adjust-by-one.
//
//


//const SAMPLE_POLYMER = 'NN';
//  0   2   NN
//  1   3   NCN
//  2   5   NBCCN
//  3   9   NBBBCNCCN
//  4  17   NBBNBNBBCCNBCNCCN
//  5  33   NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBC

//const SAMPLE_POLYMER = 'NNC';
// NNC
// NCNBC
// NBCCNBBBC

const SAMPLE_POLYMER = 'NNCB';
//  4 NNCB
//  7 NCNBCHB
// 13 NBCCNBBBCBHCB
// 25 NBBBCNCCNBBNBNBBCHBHHBCHB
// 49 NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB
// 97

const FULL_POLYMER = 'SCSCSKKVVBKVFKSCCSOV';


const SAMPLE_INSTRUCTIONS = [
  'CH -> B',
  'HH -> N',
  'CB -> H',
  'NH -> C',
  'HB -> C',
  'HC -> B',
  'HN -> C',
  'NN -> C',
  'BH -> H',
  'NC -> B',
  'NB -> B',
  'BN -> B',
  'BB -> N',
  'BC -> B',
  'CC -> N',
  'CN -> C',
];


interface Node {
  element: string;
  next: Node | null;
}


function getRawPolymer(): string {
  let rawMolecule = SAMPLE_POLYMER;
  if (process.env.SOURCE === 'FULL') {
    rawMolecule = FULL_POLYMER;
  }

  return rawMolecule;
}


function getRawInstructions(): string[] {
  let rawLines = SAMPLE_INSTRUCTIONS;
  if (process.env.SOURCE === 'FULL') {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data', 'day_14.input.instructions.txt'));
    rawLines = buffInput.toString()
      .trim()
      .split('\n');
  }

  return rawLines;
}


function parseInstructions(rawLines: string[]): Record<string, string> {
  return rawLines.reduce(
    (dict, line) => {
      const [
        pair,
        element,
      ] =line.trim().split(' -> ');
      dict[pair] = element;
      return dict;
    },
    {} as Record<string, string>
  );
}


function countsToString(counts: Record<string, number>): string {
  const chunks = Object.keys(counts)
    .sort()
    .map(k => `${k}: \x1b[33m${counts[k]}\x1b[0m`);
  return `{ ${chunks.join(', ')} }`;
}


function padForDepth(depth: number): string {
  let str = '';
  for (let d = 0; d < depth; d++) {
    str = str + '  ';
  }
  return str;
}


function getExpandedCounts(
  initialPolymer: string,
  instructions: Record<string, string>,
  totalSteps: number
): Record<string, number> {
  // This type hint is painfully verbose.
  // For each pair from the instructions,
  // create an array of empty dictionaries to hold memoized counts at each level.
  const memo: Record<string, Record<string, number>[]> = Object.keys(instructions).reduce(
    (dict, pair) => {
      const emptyCounts: Record<string, number>[] = [];
      for (let i = 0; i <= totalSteps; i++) {
        emptyCounts.push({});
      }
      dict[pair] = emptyCounts;
      return dict;
    },
    {} as Record<string, Record<string, number>[]>
  );

  let totalOps = 0;
  const memoHits: Record<string, number> = {};

  //console.dir(memo, { depth: null, maxArrayLength: null });

  function expand(pair: string, depth: number): Record<string, number> {
    if (!instructions.hasOwnProperty(pair)) {
      console.log(`No matching instruction for pair (${pair})`);
      // Return a 1 here so the off-by-one adjustments still work.
      return { [pair[0]]: 1 };
    }

    //const pad = padForDepth(totalSteps-depth);
    totalOps++;

    if (depth == 1) {
      const baseChars: string[] = [ pair[0], instructions[pair], pair[1] ];
      const baseCounts = baseChars.reduce(
        (dict, c) => {
          if (!dict.hasOwnProperty(c)) {
            dict[c] = 0;
          }
          dict[c]++;
          return dict;
        },
        {} as Record<string, number>
      );

      memo[pair][depth] = baseCounts;

      // TODO: remove logging
      //console.log(`${pad}  base case: (${baseChars.join('')}) ${countsToString(memo[pair][depth])}`);
    }


// -----------
    // TODO: remove logging
    //if (1 < depth && 0 < Object.keys(memo[pair][depth]).length) {
    //  console.log(`${pad}  counts exist: ${countsToString(memo[pair][depth])}`);
    //}
// -----------


    if (0 < Object.keys(memo[pair][depth]).length) {
      if (!memoHits.hasOwnProperty(`${pair}-${depth}`)) {
        memoHits[`${pair}-${depth}`] = 0;
      }
      memoHits[`${pair}-${depth}`]++;
      // TODO: be aware of possible side effects here.
      return memo[pair][depth];
    }
    // else - process the next level of expansion


    const left = expand(`${pair[0]}${instructions[pair]}`, depth-1);
    const right = expand(`${instructions[pair]}${pair[1]}`, depth-1);

    //console.log(`${pad}  left counts from (${pair[0]}${instructions[pair]}): ${countsToString(left)}`);
    //console.log(`${pad}  right counts from (${instructions[pair]}${pair[1]}): ${countsToString(right)}`);

    const counts = Object.keys(left).reduce(
      (dict, k) => {
        if (!dict.hasOwnProperty(k)) {
          dict[k] = left[k];
        } else {
          dict[k] += left[k];
        }
        return dict;
      },
      { ...right }
    );

    counts[instructions[pair]]--;

    memo[pair][depth] = counts;

    //console.log(`${pad}  stored counts for pair(${pair}) at depth (${depth}).`);
    //console.log(`${pad}  ${countsToString(counts)}`);

    return counts;
  };

  const allCounts: Record<string, number> = Object.keys(instructions).reduce(
    (dict, key) => {
      if (!dict.hasOwnProperty(key[0])) {
        dict[key[0]] = 0;
      }
      if (!dict.hasOwnProperty(key[1])) {
        dict[key[1]] = 0;
      }
      if (!dict.hasOwnProperty(instructions[key])) {
        dict[instructions[key]] = 0;
      }
      return dict;
    },
    {} as Record<string, number>
  );

  let pairCounts: Record<string, number>;

  for (let c = 1; c < initialPolymer.length; c++) {
    pairCounts = expand(`${initialPolymer[c-1]}${initialPolymer[c]}`, totalSteps);
    for (const key in pairCounts) {
      allCounts[key] += pairCounts[key];
    }
    if (1 < c) {
      allCounts[initialPolymer[c-1]]--;
    }
  }

  console.log(`Total ops: (${totalOps})`);
  console.log(`Unweighted sum of memo hits: ${Object.values(memoHits).reduce((s,i) => (s+i))}`);
  const weightedMemoHits = Object.keys(memoHits)
    .reduce(
      (sum, k) => {
        const [
          pair,
          strDepth,
        ] = k.split('-');
        const depth = parseInt(strDepth, 10);
        // I'm not 100% that this is correct, but it's decent.
        const ops = (3 * Math.pow(2, depth) + 1) - (3 * Math.pow(2, depth-1) + 1);
        sum += memoHits[k] * ops;
        return sum;
      },
      0
    );
  console.log(`Rough weighted value of memo hits: ${weightedMemoHits}`);

  return allCounts;
}


function day14_2(): void {
  console.log('Welcome to Day 14.2. Building really really long chains, efficiently.');

  // A linked list won't cut it now that we expect the final polymer
  // to contain a maximum of 2^39 elements.
  //
  // From the prompt, sample input yields these max/min counts:
  // B:   2 192 039 569 602
  // H:       3 849 876 073

  // First Idea:
  //  Simple jpeg-style compression
  //  Could this work?
  //  Afer reviewing FULL output from 14.1, I don't think so.
  //  There are few sequences of more than two repeated elements,
  //  so simple (H appears 10 times) tuples won't provide much compression.
  //
  // More thinking
  //
  // The state of a given index on a given step is deterministic.
  // There are 3 pairs in the initial polymer: NNCB.
  // I can "expand" NN as much as I want without affecting following pairs
  // because all the expansion happens between N and N. I know that the next
  // pair to expand will always be NC.
  //
  // How can I generalize this?
  // Identify upper bound on how much I can hold in memory,
  // then expand to chunks of that size.
  // I know the final FULL polymer will have a max length of 2^45.
  // (the FULL template polymer is already on the order of 2^5 with 20 elements)
  // Cap chunk length at 2^30 (~1gb)?
  // That yields a max of 2^15 chunks to process.
  //
  // Coming from another direction, what if I pre-compute
  // expanded 30-step counts for each ordered pair?
  // There are  16 instructions in the SAMPLE data.
  // There are 100 instructions in the FULL data.

  // Second Idea:
  //  General memoization strategy.
  //  I don't want to lock to magic numbers (e.g. pre-calc out to 30 steps).
  //
  //  What does a generic recurisve function look like?
  //
  //    function expand(pair, depth) {
  //      if (depth == 0) {
  //        memo[pair][0] = {
  //          [pair[0]]: 1,
  //          [pair[1]]: 1,
  //        };
  //      } else if (memo[pair][depth] != null) {
  //        return memo[pair][depth];
  //      }
  //      // else - compute new pairs
  //      const left = expand(`${pair[0]}${instructions[pair]}`, depth-1);
  //      const right = expand(`${instructions[pair]}${pair[1]}`, depth-1);
  //      return Object.keys(left).reduce(
  //        (dict, k) => {
  //          if (!dict.hasOwnProperty(k)) {
  //            dict[k] = left[k];
  //          } else {
  //            dict[k] += left[k];
  //          }
  //          return dict;
  //        },
  //        { ...right }
  //      );
  //    }
  //



  const STEP_COUNT = 40;
  //const STEP_COUNT = 10;

  // Read instructions into dictionary
  const instructions = parseInstructions(getRawInstructions());

  const initialPolymer = getRawPolymer();
  const elementCounts = getExpandedCounts(initialPolymer, instructions, STEP_COUNT);
  console.log('\n');
  console.log(countsToString(elementCounts));

  let minCount = Number.MAX_SAFE_INTEGER;
  let minElement = '';
  let maxCount = 0;
  let maxElement = '';

  for (const [ element, count ] of Object.entries(elementCounts)) {
    if (count < minCount) {
      minCount = count;
      minElement = element;
    }
    if (maxCount < count) {
      maxCount = count;
      maxElement = element;
    }
  }

  const finalDifference = maxCount - minCount;

  console.log(`Found least common element (${minElement}) with (${minCount}) instances.`);
  console.log(`Found most common element (${maxElement}) with (${maxCount}) instances.`);
  console.log(`Difference is (${finalDifference})`);
}


day14_2();

