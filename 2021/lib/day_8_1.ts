import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  Split lines.
//  Split output chunks.
//  Count chunks with distinct lengths.
//
//
// Complexity Analysis:
//  L: total number of lines
//  C: max number of characters on a single line
//
//  Time Complexity:
//    O(L*C)
//    Read each line, then execute two splits on it.
//
//  Space complexity:
//    O(L*C)
//    Load the entire input into memory.
//
//
// Total time:  ~10 minutes
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
  if (process.env.SOURCE === 'FULL') {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data/day_8.input.txt'));
    rawLines = buffInput.toString()
      .trim()
      .split('\n');
  }

  return rawLines;
}


function day8_1(): void {
  console.log('Welcome to Day 8.1. Maybe just use grep?');

  let countOnes = 0;
  let countFours = 0;
  let countSevens = 0;
  let countEights = 0;

  const allLines = getLines();

  allLines.forEach(line => {
    const [ _, allDigits ] = line.split(' | ');
    const chunks = allDigits.split(' ');
    chunks.forEach(c => {
      switch (c.length) {
        case 2:
          countOnes++;
          break;
        case 3:
          countSevens++;
          break;
        case 4:
          countFours++;
          break;
        case 7:
          countEights++;
          break;
        default:
          // Ignore indecipherable groups
      }
    });
  })

  const total = countOnes + countFours + countSevens + countEights;
  console.log(`Counted numbers 1 (${countOnes}), 4 (${countFours}), 7 (${countSevens}), 8 (${countEights})`);
  console.log(`Found (${total}) total instances.`);
}


day8_1();

