import * as fs from 'fs';
import path from 'path';


//
// Initial Thoughts:
//  The simple approach is:
//    - build the computer
//    - count down from 99999999999999 (skipping zeroes)
//
//  Seems straight forward enough.
//
//
//  Pseudocode
//    - for digits starting with 99999999999999
//      - walk digits, starting with leftmost
//        - run instructions each digit
//        - check z register
//          - if 1, break to start checking next model number
//      - if all Zs were zero, DONE BREAK
//
//
//  Brute force is too slow (~1sec to check ~100,000 model numbers).
//
//  What would working backwards look like?
//    - start with sequence 13 (for the ones place)
//    - reverse each instruction?
//      - Do I have enough information for this?
//        How do I reverse c = a % b?
//
//  Could I transform a sequence of instructions into a single equation?
//  Can *I* figure out how to do that programmatically and in a timely fashion?
//  Probably not.
//
//
//
//
//
// Reflections:
//
//
//



const C_RESET = '\x1b[0m';



const SAMPLE_INSTRUCTIONS = [
  'inp z',
  'inp x',
  'mul z 3',
  'eql z x',
];


type OpCode = 'inp' | 'add' | 'mul' | 'div' | 'mod' | 'eql';

type Operation = (a: number, b: number) => number;

type Register = 'w' | 'x' | 'y' | 'z';


interface Instruction {
  op: OpCode,
  left: Register,
  right: number | Register,
}


const FN: Record<OpCode, Operation> = {
  inp: (a: number, b: number): number => (a),
  add: (a: number, b: number): number => (a + b),
  mul: (a: number, b: number): number => (a * b),
  div: (a: number, b: number): number => Math.floor(a / b),
  mod: (a: number, b: number): number => (a % b),
  eql: (a: number, b: number): number => (a == b ? 1 : 0),
};



function parseLine(raw: string): Instruction {
  const [
    opCode,
    strLeft,
    strRight,
  ] = raw.trim().split(' ');

  const inst: Instruction = {
    op: opCode as OpCode,
    left: strLeft as Register,
    right: 0,
  };

  if (opCode != 'inp') {
    if (strRight == 'w' || strRight == 'x' || strRight == 'y' || strRight == 'z') {
      inst.right = strRight;
    } else {
      inst.right = parseInt(strRight, 10);
    }
  }

  return inst;
}


function getInstructions(): Instruction[][] {
  let rawLines = SAMPLE_INSTRUCTIONS;
  if (process.env.SOURCE == 'FULL') {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data', 'day_24.input.txt'));
    rawLines = buffInput.toString()
      .trim()
      .split('\n');
  }
  const instructionSets: Instruction[][] = [];
  let inst = parseLine(rawLines[0]);
  let sequence: Instruction[] = [ inst ];

  for (let i = 1; i < rawLines.length; i++) {
    inst = parseLine(rawLines[i]);
    if (inst.op == 'inp') {
      instructionSets.push(sequence);
      sequence = [];
    }
    sequence.push(inst);
  }
  instructionSets.push(sequence);

  return instructionSets;
}


function arr2int(nums: number[]): number {
  let integer = 0;
  for (let i = 0; i < nums.length; i++) {
    integer += nums[i] * Math.pow(10, (nums.length-1-i));
  }
  return integer;
}


function findMaxModelNumber(allChecks: Instruction[][]): number {
  const MEM: Record<Register, number> = {
    w: 0,
    x: 0,
    y: 0,
    z: 0,
  };

  let counter = 99999999999999;
  const modelNumber = [ 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9 ];
  const onesPlace = modelNumber.length - 1;
  let countValid = 0;

  while (11111111111110 < counter) {
    MEM.w = 0;
    MEM.x = 0;
    MEM.y = 0;
    MEM.z = 0;
    countValid = 0;

    if (counter % 100000 == 99999) {
      console.log(`Checking (${counter})`);
    }

    modelNumber.forEach((num, idxDigit) => {
      //console.log(`  checking digit (${num}) at (${idxDigit})`);
      let register: Register;
      allChecks[idxDigit].forEach((inst) => {
        register = inst.left;
        if (inst.op == 'inp') {
          MEM[register] = FN.inp(num, 0);
        } else {
          const numLeft = MEM[register];
          let numRight = 0;
          if (typeof inst.right == 'number') {
            numRight = inst.right;
          } else {
            numRight = MEM[inst.right as Register];
          }
          MEM[register] = FN[inst.op](numLeft, numRight);
        }
      });
      if (MEM.z == 0) {
        countValid++;
      }
    });

    if (countValid == modelNumber.length) {
      return counter;
    }

    for (let d = onesPlace; 0 <= d; d--) {
      modelNumber[d]--;
      if (modelNumber[d] == 0) {
        for (let k = d; k < modelNumber.length; k++) {
          modelNumber[k] = 9;
        }
      } else {
        break;
      }
    }
    counter = arr2int(modelNumber);

  }

  return -1;
}


function day24_1(): void {
  console.log('Welcome to Day 24.1. Instructions Assemble.');

  const checkers = getInstructions();
  //console.dir(checkers, { depth: null, maxArrayLength: null });
  checkers.forEach((c, i) => {
    console.log(`Checkers at (${i}):`);
    console.dir(c,{ depth: null, maxArrayLength: null })
  }); 

  const maxModelNumber = findMaxModelNumber(checkers);
  console.log(`Found maximum model number (${maxModelNumber}).`);
}


day24_1();


// One weird trick to prevent TypeScript compiler from
// intermittently complaining about global declarations.
// https://stackoverflow.com/a/50913569
export {};

