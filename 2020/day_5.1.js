const seats = require('./day_5.data');


const ROW_MAX = 127;
const COL_MAX = 7;

const ROW_BLOCK_LENGTH = 7;
const COL_BLOCK_LENGTH = 3;


function stringToRow(steps) {
  let c = 0;
  // TODO: do min/max here instead of a single row
  let row = ROW_MAX;
  let direction = 0;
  while (c < ROW_BLOCK_LENGTH) {
    if (steps[c] === 'F') {
      direction = -1;
    } else if (steps[c] === 'B') {
      direction = 1;
    }
    // else - zomgwtf
    row = row + (direction * ((ROW_MAX+1) / Math.pow(2, (c+1))));
    console.log(`step ${steps[c]} at ${c} means ${(direction * ((ROW_MAX+1) / Math.pow(2, (c+1))))}`);
    c++;
  }
  return row;
}

function stringtoColumn(rawSteps) {
  let c = ROW_BLOCK_LENGTH;
  while (c < (ROW_BLOCK_LENGTH + COL_BLOCK_LENGTH)) {
    c++;
  }
  return 0;
}


let max = 0;
let row = 0;
let col = 0;
let s = 0;
let c = 0;
while (s < seats.length) {
  row = stringToRow(seats[s]);
  //col = stringToRow(seats[s]);
  if (10 <= s) { break; }
  s++;
}



