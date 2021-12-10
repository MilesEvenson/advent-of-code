import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  Walk stack, finding matching closer for each opener,
//  do math with that closer,
//  and push autocomplete score onto list.
//  Sort autocomplete scores and take midpoint.
//
//
// Complexity Analysis:
//  L: total lines to process
//  C: max number of characters in a line
//
//  Time Complexity:
//    O( (L * 2C) + (L * log2L) )
//    Process every character on every line.
//    Process every unmatched opener (worst case, every char in the line).
//    Sort list of autocomplete scores (worst case, this is every line).
//
//
//  Space complexity:
//    O(2L * C)
//    Store entire input in memory.
//    Store list of autocomplete scores (worst case, one for each line).
//    Technically also store 1 stack of length C.
//
//
// Total time:    ~30 minutes
//  Planning        7
//  Programming    10
//  Debugging      11
//
//



const SAMPLE_LINES = [
  '[({(<(())[]>[[{[]{<()<>>',
  '[(()[<>])]({[<{<<[]>>(',
  '{([(<{}[<>[]}>{[]{[(<()>',
  '(((({<>}<{<{<>}{[]{[]{}',
  '[[<[([]))<([[{}[[()]]]',
  '[{[{({}]{}}([{[{{{}}([]',
  '{<[[]]>}<{[{[{[]{()[[[]',
  '[<(<(<(<{}))><([]([]()',
  '<{([([[(<>()){}]>(<<{{',
  '<{([{{}}[<[[[<>{}]]]>[]]',
];


function getLines(): string[] {
  let rawLines = SAMPLE_LINES;
  if (process.env.SOURCE === 'FULL') {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data/day_10.input.txt'));
    rawLines = buffInput.toString()
      .trim()
      .split('\n');
  }

  return rawLines;
}


function isOpener(c: string): boolean {
  return (c == '('
    || c == '['
    || c == '{'
    || c == '<'
  );
}


function isMatchingCloser(opener: string, closer: string): boolean {
  switch (opener) {
    case '(':
      return closer == ')';
    case '[':
      return closer == ']';
    case '{':
      return closer == '}';
    case '<':
      return closer == '>';
    default:
      return false;
  }
}


function day10_1(): void {
  console.log('Welcome to Day 10.1. We must find balance.');

  // Keep track of openers with a stack
  // Pop off opener when the appriate closer is in the correct location
  // Update points when an illegal closer is found

  const lines = getLines();

  const POINTS_ERROR: Record<string, number> = {
    ')':     3,
    ']':    57,
    '}':  1197,
    '>': 25137,
  };

  const POINTS_MATCH: Record<string, number> = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
  };

  const OPENER_CLOSERS: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
  };

  let countIncomplete = 0;
  let countCorrupt = 0;
  let totalCorruption = 0;
  const autocompleteScores: number[] = [];
  let tempScore = 0;
  let isCorrupt = false;
  let stack: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    console.dir(lines[i]);
    stack = [];
    isCorrupt = false;
    for (let c = 0; c < lines[i].length; c++) {
      if (isOpener(lines[i][c])) {
        //console.log(`  adding opener "${lines[i][c]}"`);
        stack.unshift(lines[i][c]);
      } else {
        if (isMatchingCloser(stack[0], lines[i][c])) {
          //console.log(`  popping matching closer "${lines[i][c]}"`);
          stack.shift();
        } else {
          console.log(`  expected "${OPENER_CLOSERS[stack[0]]}", but found "${lines[i][c]}" instead.`);
          totalCorruption += POINTS_ERROR[lines[i][c]];
          isCorrupt = true;
          break;
        }
      }
    }

    let closer = '';
    if (!isCorrupt) {
      tempScore = 0;
      for (let n = 0; n < stack.length; n++) {
        closer = OPENER_CLOSERS[stack[n]];
        tempScore = tempScore * 5;
        tempScore += POINTS_MATCH[closer];
      }
      autocompleteScores.push(tempScore);
    }
  }


  autocompleteScores.sort((a, b) => (a - b));
  console.dir(autocompleteScores);
  const midpoint = Math.floor(autocompleteScores.length / 2);
  

  console.log(`Calculated total corruption (${totalCorruption}).`);
  console.log(`Middle autocomplete score is (${autocompleteScores[midpoint]})`);
}


day10_1();

