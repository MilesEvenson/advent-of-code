const data = require('./day_5.data');


const ROW_MAX = 127;
const COL_MAX = 7;

const ROW_BLOCK_LENGTH = 7;
const COL_BLOCK_LENGTH = 3;


function stringToRow(data) {
  let front = 0;
  let back = ROW_MAX;
  let step = 0;
  let i = 0;
  while (i < ROW_BLOCK_LENGTH) {
    step = (ROW_MAX + 1) / Math.pow(2, (i + 1));
    if (data[i] === 'F') {
      back -= step;
    } else if (data[i] === 'B') {
      front += step;
    }
    // else - zomgwtf
    i++;
  }
  return front;
}

function stringtoColumn(data) {
  let left = 0;
  let right = COL_MAX;
  let step = 0;
  let i = 0;
  let OFFSET = ROW_BLOCK_LENGTH;
  while (i < COL_BLOCK_LENGTH) {
    step = (COL_MAX + 1) / Math.pow(2, (i + 1));
    if (data[(i + OFFSET)] === 'L') {
      right -= step;
    } else if (data[(i + OFFSET)] === 'R') {
      left += step;
    }
    // else - zomgwtf
    i++;
  }
  return left;
}


function calculateId(row, column) {
  return (row * 8) + column;
}


function findMaxId(tickets) {
  let id = 0;
  let max = 0;
  let row = 0;
  let col = 0;
  let t = 0;
  while (t < tickets.length) {
    row = stringToRow(tickets[t]);
    col = stringtoColumn(tickets[t]);
    id = calculateId(row, col);
    if (max < id) {
      max = id;
    }
    t++;
  }
  return max;
}

const maxId = findMaxId(data);
console.log(`Max Seat ID: ${maxId}`);


