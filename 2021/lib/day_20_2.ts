import * as fs from 'fs';
import path from 'path';


//
// Initial Thoughts:
//  ...
//
//
// Reflections
//  Fixed a bug in how I handle the infinite cells
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


function enhance(image: string[][], algo: string, step: number): string[][] {

  function getPixel(row: number, col: number, step: number): string {
    if (row < 0 || col < 0 || image.length <= row || image[0].length <= col) {
      if (step % 2 == 0) {
        return algo[0];
      } else {
        return algo[511];
      }
    }
    return image[row][col];
  }

  function getNeighbors(row: number, col: number): string[] {
    const pixels: string[] = [];
    // NW N NE W C E SW S SE
    for (let nr = row-1; nr <= row+1; nr++) {
      for (let nc = col-1; nc <= col+1; nc++) {
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
      // add to newImage
      tempLine.push(newPixel);
    }
    newImage.push(tempLine);
  }

  return newImage;
}


function day20_2(): void {
  console.log('Welcome to Day 20.2. Enhance again!');

  const algo = getAlgorithm();

  let image = getImage();
  console.log(`\nStep 0`);
  image.forEach(line => console.log(line.join('')));

  for (let i = 1; i <= 50; i++) {
    image = enhance(image, algo, i);
    //console.log(`\nStep ${i}`);
    image.forEach(line => console.log(line.join('')));
  }

  image.forEach(line => console.log(line.join('')));

  const totalLightPixels = image.reduce(
    (sum, line) => (sum + line.reduce((ls, p) => (p == '#' ? (ls+1) : ls), 0)),
    0
  );

  console.log(`Found (${totalLightPixels}) total lit pixels.`);
}


day20_2();

