import * as fs from 'fs';
import path from 'path';


//
// Initial Thoughts:
//  ...
//
//
// Reflection:
//  Just dove into this implementation.
//  Stumbled a little with padding and accounting for the surrounding pixels.
//
//  Hit a wall after that and couldn't figure out why
//  my solution wasn't working for the FULL input.
//  Ended up reading solutions on Reddit :(
//  I'm not sure I would have figured out my problem quickly.
//  Glad I didn't burn more time on this, but maybe should
//  have stepped away for a while to let my subconcious digest things.
//
//
//
//



const C_RESET = '\x1b[0m';


const PIXEL_MAP: Record<string, string> = {
  '.': '0',
  '#': '1',
};


const SAMPLE_ALGO = '..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#';

const FULL_ALGO = '#.#..#..####....##.##..#.#.###..###..######.#..#####.#..###..#.####.#..###.##..#.......##....###...#####....#.##..#.#.#...###..#.####.##.#.###...#.###.##.#..#.#..#....#.#.#...#...#.#....###.#.#.#....###.##..#.##...##.#..##...##########.####....#..##..###.#..###..#.#...########.#.##.##...##....#.#..####.###....#.....#.##.#.##.......#....###......###..#.###.#...######..###..#..#.....##.###..##.###....##..#..#..##..##.#.###.#.#.#...#.#####.....#.##.....#..####.###.#.#.######.###.....##.#...#.###..#####...##...';


const SAMPLE_IMAGE = [
  '#..#.',
  '#....',
  '##..#',
  '..#..',
  '..###',
];


function getAlgorithm(): string {
  if (process.env.SOURCE == 'FULL') {
    return FULL_ALGO;
  }
  return SAMPLE_ALGO;
}


function getImage(): string[][] {
  let rawLines = SAMPLE_IMAGE;
  if (process.env.SOURCE == 'FULL') {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data', 'day_20.input.txt'));
    rawLines = buffInput.toString()
      .trim()
      .split('\n');
  }
  return rawLines.map(line => line.split(''));
}


function pixels2Bin(pixels: string[]): string {
  return pixels.map(p => PIXEL_MAP[p]).join('');
}


function enhance(
  image: string[][],
  algo: string,
  step: number,
  debug: boolean
): string[][] {

  function getPixel(row: number, col: number, step: number): string {
    if (row < 0 || col < 0 || image.length <= row || image[0].length <= col) {
      if (step % 2 == 0) {
        return '.';
      } else {
        return '#';
      }
    }
    return image[row][col];
  }

  function getNeighbors(row: number, col: number): string[] {
    const pixels: string[] = [];
    // NW N NE W C E SW S SE
    for (let nr = row-1; nr <= row+1; nr++) {
      for (let nc = col-1; nc <= col+1; nc++) {
        if (debug) {
          console.log(`  nr, nc (${nr}, ${nc}) [${getPixel(nr, nc, step)}]`);
        }
        pixels.push(getPixel(nr, nc, step));
      }
    }
    return pixels;
  }

  const newImage: string[][] = [];
  let tempLine: string[];
  let nebs: string[];
  let strBin: string;
  let lookup: number;
  let newPixel: string;

  // for each pixel
  for (let r = -1; r < image.length+1; r++) {
    tempLine = [];
    for (let c = -1; c < image[0].length+1; c++) {
      // get surrounding pixels
      nebs = getNeighbors(r, c);
      // map to binary
      strBin = pixels2Bin(nebs);
      // convert to dec
      lookup = parseInt(strBin, 2);
      // lookup in algo
      newPixel = algo[lookup];
      if (debug) {
        console.log(`At pixel (${r}, ${c}) with bin (${strBin}) => (${newPixel})`);
      }
      // add to newImage
      tempLine.push(newPixel);
    }
    newImage.push(tempLine);
  }

  return newImage;
}


function day20_1(): void {
  console.log('Welcome to Day 20.1. Enhance!');

  const algo = getAlgorithm();

  const image0 = getImage();
  console.log(`\nImage 0 is ${image0[0].length} x ${image0.length} pixels.`);
  image0.forEach(line => console.log(line.join('')));

  const image1 = enhance(image0, algo, 0, false);
  console.log(`\nImage 1 is ${image1[0].length} x ${image1.length} pixels.`);
  image1.forEach(line => console.log(line.join('')));

  const image2 = enhance(image1, algo, 1, true);
  console.log(`\nImage 2 is ${image2[0].length} x ${image2.length} pixels.`);
  image2.forEach(line => console.log(line.join('')));


  const totalLightPixels = image2.reduce(
    (sum, line) => (sum + line.reduce((ls, p) => (p == '#' ? (ls+1) : ls), 0)),
    0
  );

  // 5820   high
  // 5292   low
  // 5569   high
  // 5479   after cheating

  // 0 pad  5061  low
  // 1 pad  5569  high

  console.log(`Found (${totalLightPixels}) total lit pixels.`);
}


day20_1();

