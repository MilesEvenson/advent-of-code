const OPERATIONS = require('./day_8.data');
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


const ACC = 'acc';
const JUMP = 'jmp';
const NOOP = 'nop';



function parseArg(rawArg) {
  let sign = 1;
  if (rawArg[0] === '-') {
    sign = -1;
  }
  return (sign * parseInt(rawArg.substring(1), 10));
}


function main() {
  let acc = 0;
  let ptr = 0;
  let op = '';
  let arg = 0;
  let rawArg = 0;

  const executed = new Set();

  while (ptr < OPERATIONS.length) {
    [ op, rawArg ] = OPERATIONS[ptr];
    arg = parseArg(rawArg);
    executed.add(ptr);
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
    if (executed.has(ptr)) {
      break;
    }
  }

  console.log(`Exiting before duplicate execution of operation at ${ptr}`);
  console.log(`acc = ${acc}`);
}


main();
