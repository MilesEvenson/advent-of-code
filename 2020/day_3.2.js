const hill = require('./day_3.data');
const WIDTH = hill[0].length;


const slopes = {
  1: [
    { DX: 1, x: 0, treeCount: 0 },
    { DX: 3, x: 0, treeCount: 0 },
    { DX: 5, x: 0, treeCount: 0 },
    { DX: 7, x: 0, treeCount: 0 },
  ],
  2: [
    { DX: 1, x: 0, treeCount: 0 },
  ],
};


Object.keys(slopes).forEach(DY => {
  let y = 0;
  while (y < hill.length) {
    slopes[DY].forEach(path => {
      if (hill[y][path.x] === '#') {
        path.treeCount++;
      }
      path.x = (path.x + path.DX) % WIDTH;
    });
    y += parseInt(DY);
  }
});


Object.keys(slopes).forEach(DY => {
  slopes[DY].forEach(path => {
    console.log(`Slope ${path.DX} - ${DY} hit ${path.treeCount} trees`);
  });
});



