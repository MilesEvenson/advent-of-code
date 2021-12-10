import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  For each line:
//    - Find 1, 4, 7, 8 (the unique signatures).
//    - Identify segments from segment counts and the 4 unique signatures.
//    - Define remaining 6 numbers with identified segments.
//    - Parse individual digits on line.
//    - Join digits into a full number.
//
//
// Complexity Analysis:
//  L: total number of lines
//  C: max number of characters on a single line
//
//  Time Complexity:
//    O(L * C)
//    This approach still executes several splits per line,
//    plus an unimportant small number of short loops per line
//    while parsing segments.
//
//  Space complexity:
//    O(L * C)
//    Load the entire input into memory.
//
//
// Total time:  ~135 minutes
//  So many copy/pasta errors and typos :(
//  Probably spent a good 45 minutes debugging.
//



const SAMPLE_LINES = [
  'be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe',
  'edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc',
  'fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg',
  'fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb',
  'aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea',
  'fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb',
  'dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe',
  'bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef',
  'egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb',
  'gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce',
];


function getLines(): string[] {
  let rawLines = SAMPLE_LINES;
  if (process.env.SOURCE == 'FULL') {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data/day_8.input.txt'));
    rawLines = buffInput.toString()
      .trim()
      .split('\n');
  }

  return rawLines;
}


function setFromChunk(chunk: string): Set<string> {
  return new Set(chunk.split(''));
}


function deduceDigits(rawDefinitions: string): Set<string>[] {
  // Plan A:
  //  Make two passes:
  //    1. Identify 1, 4, 7, 8 by their unique signatures.
  //    2. Define segments by counts, and using the 4 unique signatures.
  //    3. Use segment mapping to translate definitions to digits.

  // Deductions
  //
  //  hTop:   appears exactly 8 && not in 1
  //  hMid:   appears exactly 7 times && in 4
  //  hBot:   appears exactly 7 times && not in 1
  //  vTL:    appears exactly 6 times
  //  vTR:    appears exactly 8 times && in 1
  //  vBL:    appears exactly 4 times
  //  vBR:    appears exactly 9 times (all digits except 2)
  //
  //  0:  define with segments
  //  1:  only 2-char digit
  //  2:  define with segments
  //  3:  define with segments
  //  4:  only 4-char digit
  //  5:  define with segments
  //  6:  define with segments
  //  7:  only 3-char digit
  //  8:  only 7-char digit
  //  9:  define with segments


  // First attempt: Make deductions incrementally.
  //                Don't try to get deduce all segments, then all digits.

  const definitions: Set<string>[] = Array(10);

  const chunks = rawDefinitions.split(' ');
  //console.log(chunks.join(', '));

  const segmentCounts = chunks.reduce(
    (dict, k) => {
      for (let c = 0; c < k.length; c++) {
        dict[k[c]]++;
      }
      return dict;
    },
    { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 } as Record<string, number>
  );

  //console.dir(segmentCounts);

  for (let u = 0; u < chunks.length; u++) {
    switch (chunks[u].length) {
      case 2:
        definitions[1] = setFromChunk(chunks[u]);
        break;
      case 3:
        definitions[7] = setFromChunk(chunks[u]);
        break;
      case 4:
        definitions[4] = setFromChunk(chunks[u]);
        break;
      case 7:
        definitions[8] = setFromChunk(chunks[u]);
        break;
      // default: noop
    }
  }

  let hTop = '';
  let hMid = '';
  let hBot = '';
  let vTL = '';
  let vTR = '';
  let vBL = '';
  let vBR = '';

  for (const [c, count] of Object.entries(segmentCounts)) {
    if (count === 8 && !definitions[1].has(c)) {
      hTop = c;
    } else if (count == 7 && definitions[4].has(c)) {
      hMid = c;
    } else if (count == 7 && !definitions[4].has(c)) {
      hBot = c;
    } else if (count == 6) {
      vTL = c;
    } else if (count == 8 && definitions[1].has(c)) {
      vTR = c;
    } else if (count == 4) {
      vBL = c;
    } else if (count == 9) {
      vBR = c;
    }
  }

  //console.log(hTop, hMid, hBot, vTL, vTR, vBL, vBR);

  definitions[0] = new Set([ hTop, vTL, vTR, vBL, vBR, hBot])
  definitions[2] = new Set([ hTop, vTR, hMid, vBL, hBot ]);
  definitions[3] = new Set([ hTop, vTR, hMid, vBR, hBot ]);
  definitions[5] = new Set([ hTop, vTL, hMid, vBR, hBot ]);
  definitions[6] = new Set([ hTop, vTL, hMid, vBL, vBR, hBot ]);
  definitions[9] = new Set([ hTop, vTL, vTR, hMid, vBR, hBot ]);

  return definitions;
}


function parseNumbers(rawNumbers: string, defs: Set<string>[]): number[] {
  return rawNumbers.split(' ')
    .map((strNum, idx): number => {
      let match = true;
      for (let d = 0; d < defs.length; d++) {
        if (defs[d].size === strNum.length) {
          match = true;
          for (let c = 0; c < strNum.length; c++) {
            match = match && defs[d].has(strNum[c]);
          }
          if (match) {
            return d;
          }
        }
      }
      console.error(`Failed to find a match for string (${strNum})`, defs);
      return 0;
    });
}


function day8_2(): void {
  console.log('Welcome to Day 8.2. Deducing digits.');

  let countOnes = 0;
  let countFours = 0;
  let countSevens = 0;
  let countEights = 0;

  const allLines = getLines();

  const total = allLines.reduce(
    (sum, line) => {
      const [
        rawDefinitions,
        rawDigits,
      ] = line.split(' | ');
      //console.log(rawDigits);
      const defs = deduceDigits(rawDefinitions);
      const numbers = parseNumbers(rawDigits, defs);
      //console.log(numbers.join(''));
      return sum + parseInt(numbers.join(''), 10);
    },
    0
  );

  console.log(`Calculated total (${total}).`);
}


day8_2();

