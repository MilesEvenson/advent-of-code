import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  Classic use-case for a stack!
//  Push openers onto stack.
//  Pop matching closers.
//  Update total points for invalid closers.
//
//
// Complexity Analysis:
//  L: total lines to process
//  C: max number of characters in a line
//
//  Time Complexity:
//    O(L * C)
//    Process every character on every line
//
//  Space complexity:
//    O(L * C)
//    Store entire input in memory.
//    Technically also store stack of length C.
//
//
// Total time:  ~30 minutes
//  Planning       8
//  Programming   14
//  Debugging      7
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

  const POINTS: Record<string, number> = {
    ')':     3,
    ']':    57,
    '}':  1197,
    '>': 25137,
  };

  const OPENER_CLOSERS: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
  };

  let totalPoints = 0;
  let stack: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    console.dir(lines[i]);
    stack = [];
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
          totalPoints += POINTS[lines[i][c]];
          break;
        }
      }
    }
  }
  

  console.log(`Calculated total points (${totalPoints}).`);
}


day10_1();

