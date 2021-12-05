import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  Not much to add to what I said for 5.1.
//  Again, I'm tempted to attempt extracting/generalizing
//  some logic (today: point generation), but again,
//  I'm not sure it's worth it for this problem.
//
//
// Complexity Analysis:
//  S: number of segments
//  P: number of points across all segments
//  G: number of occupied points
//
//  Time Complexity:
//    O(P)
//    This solution touches each point on every segment.
//
//  Space complexity:
//    O(P + G)
//    This solution generates every point on every segment,
//    plus it stores overlap counts for each of those points.
//
//
// Total time:  ~10 minutes
//
//



const SAMPLE_LINES = [
  '0,9 -> 5,9',
  '8,0 -> 0,8',
  '9,4 -> 3,4',
  '2,2 -> 2,1',
  '7,0 -> 7,4',
  '6,4 -> 2,0',
  '0,9 -> 2,9',
  '3,4 -> 1,4',
  '0,0 -> 8,8',
  '5,5 -> 8,2',
];


interface Point {
  x: number;
  y: number;
}


interface Segment {
  start: Point;
  end: Point;
}


function parseSegment(rawLine: string): Segment {
  const [
    rawStart,
    _,
    rawEnd,
  ] = rawLine.split(' ');
  const [ strStartX, strStartY ] = rawStart.split(',');
  const [ strEndX, strEndY ] = rawEnd.split(',');

  return {
    start: {
      x: parseInt(strStartX, 10),
      y: parseInt(strStartY, 10),
    },
    end: {
      x: parseInt(strEndX, 10),
      y: parseInt(strEndY, 10),
    },
  };
}


function getSegments(): Segment[] {
  let rawLines: string[] = [];
  if (process.env.SOURCE === 'SAMPLE') {
    rawLines = SAMPLE_LINES;
  } else {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data/day_5.input.txt'));
    rawLines = buffInput.toString().split('\n').filter(s => s.length);
  }

  return rawLines.map(parseSegment);
}


function formatSegment(segment: Segment): string {
  return `${segment.start.x},${segment.start.y} -> ${segment.end.x},${segment.end.y}`;
}


function formatGrid(
  grid: Record<string, number>,
  maxX: number,
  maxY: number
): string {
  const allRows: string[] = [];
  let row = '';
  let slug = '';
  for (let y = 0; y <= maxY; y++) {
    row = '';
    for (let x = 0; x <= maxX; x++) {
      slug = `${x},${y}`;
      if (grid.hasOwnProperty(slug)) {
        row += `${grid[slug]}`;
      } else {
        row += '.';
      }
    }
    allRows.push(row);
  }
  return allRows.join('\n');
}


function getPointsForSegment(segment: Segment): Point[] {
  const { start, end } = segment;
  const points: Point[] = [];
  let diff = 0;
  let direction = 1;

  if (start.x === end.x) {
    console.log(`Processing vertical segment (${formatSegment(segment)})`);

    diff = end.y - start.y;
    if (diff < 0) {
      direction = -1;
    }

    for (let i = 0; i <= Math.abs(diff); i++) {
      points.push({ x: start.x, y: (start.y + (i * direction)) });
    }

  } else if (start.y === end.y) {
    console.log(`Processing horizontal segment (${formatSegment(segment)})`);

    // TODO: Maaaaybe pull this out to a single, generic function?
    diff = end.x - start.x;
    if (diff < 0) {
      direction = -1;
    }

    for (let i = 0; i <= Math.abs(diff); i++) {
      points.push({ x: (start.x + (i * direction)), y: start.y });
    }

  } else {
    console.log(`Processing diagonal segment (${formatSegment(segment)})`);

    // TODO: Maaaaybe pull this out to a single, generic function?
    const diffX = end.x - start.x;
    const diffY = end.y - start.y;
    let dirX = 1;
    let dirY = 1;

    if (diffX < 0) {
      dirX = -1;
    }
    if (diffY < 0) {
      dirY = -1;
    }

    // The diagonals will always be at a 45deg angle,
    // so both X and Y diffs will have the same absolute value.
    for (let i = 0; i <= Math.abs(diffX); i++) {
      points.push({
        x: (start.x + (i * dirX)),
        y: (start.y + (i * dirY)),
      });
    }
  }

  return points;
}


function day5_1(): void {
  console.log('Welcome to Day 5.1. Deep sea cartography.');

  // init empty dict to store point counts
  // get segments
  // walk segements
  //  update counts

  const segments = getSegments();

  const grid: Record<string, number> = {};
  let countPointsTotal = 0;
  let countPointsWithOverlap = 0;
  let maxX = -1;
  let maxY = -1;
  let points: Point[];
  let slug = '';

  for (const seg of segments) {
    points = getPointsForSegment(seg);
    //console.log(`  Got points`, points);
    for (const pt of points) {
      countPointsTotal++;
      slug = `${pt.x},${pt.y}`;
      if (!grid.hasOwnProperty(slug)) {
        grid[slug] = 0;
      }
      grid[slug]++;
      if (grid[slug] === 2) {
        countPointsWithOverlap++;
      }
      if (maxX < pt.x) {
        maxX = pt.x;
      }
      if (maxY < pt.y) {
        maxY = pt.y;
      }
    }
  }

  console.log(`Processed (${segments.length}) segments with (${countPointsTotal}) total points.`);
  if (process.env.SOURCE === 'SAMPLE') {
    console.log(formatGrid(grid, maxX, maxY));
  }

  console.log(`There are (${countPointsWithOverlap}) points overlapped by 2+ lines.`);
}


day5_1();

