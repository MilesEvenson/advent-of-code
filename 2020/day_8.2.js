const INSTRUCTIONS = require('./day_8.data');
const SAMPLE = [
  [ 'nop', '+0' ],
  [ 'acc', '+1' ],
  [ 'jmp', '+4' ],
  [ 'acc', '+3' ],
  [ 'jmp', '-3' ],
  [ 'acc', '-99' ],
  [ 'acc', '+1' ],
  [ 'jmp', '-4' ],
  [ 'acc', '+6' ],
];


// 40359
//  1688


const ACC = 'acc';
const JUMP = 'jmp';
const NOOP = 'nop';


function getInstructions() {
  return INSTRUCTIONS;
  //return SAMPLE;
}


function parseArg(rawArg) {
  let sign = 1;
  if (rawArg[0] === '-') {
    sign = -1;
  }
  return (sign * parseInt(rawArg.substring(1), 10));
}


function shouldBranch(op) {
  return op === JUMP || op === NOOP;
}


function getAlternateOp(op) {
  if (op === JUMP) {
    return NOOP;
  } else if (op === NOOP) {
    return JUMP;
  }
  return '';
}


function main() {
  let acc = 0;
  let ptr = 0;
  let rawArg = 0;
  let arg = 0;
  let rawOp = '';
  let op = '';

  const instructions = getInstructions();

  let branchPoint = 0;
  let preBranchAcc = 0;
  let onBranch = false;
  let isBacktracking = false;

  const executed = new Set();
  let executedOnBranch = new Set();

  while (ptr < instructions.length) {
    [ rawOp, rawArg ] = instructions[ptr];
    op = rawOp;
    arg = parseArg(rawArg);

    if (onBranch) {
      executedOnBranch.add(ptr);
    } else {
      if (!isBacktracking && shouldBranch(rawOp)) {
        console.log(`Time to branch at ${ptr}, mainline op is (${rawOp})`);
        executedOnBranch = new Set();
        onBranch = true;
        preBranchAcc = acc;
        branchPoint = ptr;
        op = getAlternateOp(rawOp);
        instructions[ptr][0] = op;
        console.log(`  branch op is (${op})`);
      } else {
        if (isBacktracking) {
          console.log(`    backtracked!`);
        }
        executed.add(ptr);
      }
    }

    console.log(`  Executing Instruction at [${ptr}]: ${op} ${arg}`);
    if (op === ACC) {
      acc += arg;
      ptr++;
    } else if (op === JUMP) {
      ptr += arg;
    } else if (op === NOOP) {
      ptr++;
    } else {
      console.error(`ERROR: unknown operation (${op})`);
      break;
    }

    if (ptr === instructions.length) {
      console.log(`Successfully completed execution`);
      break;
    } else if (instructions.length < ptr) {
      console.log(`Fell off the end after branching at ${branchPoint}`);
      instructions[branchPoint][0] = getAlternateOp(instructions[branchPoint][0]);
      executedOnBranch = new Set();
      acc = preBranchAcc;
      ptr = branchPoint;
      onBranch = false;
      isBacktracking = true;
    } else if (executed.has(ptr)) {
      console.log(`Loop detected to a pre-branch instruction after branching at ${branchPoint}`);
      instructions[branchPoint][0] = getAlternateOp(instructions[branchPoint][0]);
      executedOnBranch = new Set();
      acc = preBranchAcc;
      ptr = branchPoint;
      onBranch = false;
      isBacktracking = true;
    } else if (executedOnBranch.has(ptr)) {
      console.log(`Loop detected to an on-branch instruction after branching at ${branchPoint}`);
      instructions[branchPoint][0] = getAlternateOp(instructions[branchPoint][0]);
      executedOnBranch = new Set();
      acc = preBranchAcc;
      ptr = branchPoint;
      onBranch = false;
      isBacktracking = true;
    } else {
      isBacktracking = false;
    }
  }

  console.log(`Exiting before duplicate execution of operation at ${ptr}`);
  console.log(`acc = ${acc}`);
}


main();
