const hill = require('./day_3.data');
const WIDTH = hill[0].length;

const DX = 3;
const DY = 1;

let x = 0;
let y = 0;

let treeCount = 0;

while (y < hill.length) {
  if (hill[y][x] === '#') {
    treeCount++;
  }
  y += DY;
  x = (x + DX) % WIDTH;
}


console.log(`Hit ${treeCount} trees`);


