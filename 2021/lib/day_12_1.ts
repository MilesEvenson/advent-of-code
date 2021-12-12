import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//
//
// Complexity Analysis:
//
//  Time Complexity:
//
//  Space complexity:
//
//
// Total time:   ~?? minutes
//  Planning      ??
//  Programming   ??
//  Debugging     ??
//



const SAMPLE_SMALL = [
  'start-A',
  'start-b',
  'A-c',
  'A-b',
  'b-d',
  'A-end',
  'b-end',
];


const SAMPLE_MEDIUM = [
  'dc-end',
  'HN-start',
  'start-kj',
  'dc-start',
  'dc-HN',
  'LN-dc',
  'HN-end',
  'kj-sa',
  'kj-HN',
  'kj-dc',
];


const SAMPLE_LARGE = [
  'fs-end',
  'he-DX',
  'fs-he',
  'start-DX',
  'pj-DX',
  'end-zg',
  'zg-sl',
  'zg-pj',
  'pj-he',
  'RW-he',
  'fs-DX',
  'pj-RW',
  'zg-RW',
  'start-pj',
  'he-WI',
  'zg-he',
  'pj-fs',
  'start-RW',
];


function getLines(): string[] {
  let rawLines = SAMPLE_SMALL;
  if (process.env.SOURCE === 'MEDIUM') {
    rawLines = SAMPLE_MEDIUM;
  } else if (process.env.SOURCE === 'LARGE') {
    rawLines = SAMPLE_LARGE;
  } else if (process.env.SOURCE === 'FULL') {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data', 'day_11.input.txt'));
    rawLines = buffInput.toString()
      .trim()
      .split('\n');
  }

  return rawLines;
}


interface Cave {
  id: string;
  isBig: boolean;
  links: Cave[];
  visits: number;
}


interface Node {
  id: string;
  children: string[];
}


function loadCaves(): Record<string, Cave> {
  const lines = getLines();
  return lines.reduce(
    (dict, rawLine): Record<string, Cave> => {
      const [ source, dest ] = rawLine.split('-');
      if (!dict.hasOwnProperty(source)) {
        dict[source] = {
          id: source,
          isBig: (65 <= source.charCodeAt(0) && source.charCodeAt(0) <= 90),
          links: [dest],
          visits: 0,
        };
      } else {
        dict[source].links.push(dest);
      }

      if (!dict.hasOwnProperty(dest)) {
        dict[dest] = {
          id: dest,
          isBig: (65 <= dest.charCodeAt(0) && dest.charCodeAt(0) <= 90),
          links: [source],
          visits: 0,
        };
      } else {
        dict[dest].links.push(source);
      }

      return dict;
    },
    {} as Record<string, Cave>
  );
}


function day12_1(): void {
  console.log('Welcome to Day 12.1. Hope there are no adjacent big caves.');

  
  // I think I can use an array instead of a stack because this is an undirected graph.
  // I think I want breadth-first traversal here.
  // How to store a growing list of paths?
  // Copying seems suboptimal.
  // Could do a trie(ish?) again?
  // Feels good to me.

  // How to track if a small cave has appeared in a given chain?


  const caves = loadCaves();

  let totalPaths = 0;

  const root: Node = {
    id: 'start',
    children: [],
  };
  const queue: Node[] = [ root ];
  let node: Node;

  // while queue has nodes
  while (0 < queue.length) {
    // shift off the next node
    node = queue.shift() as Node;

    caves[node.id].links.forEach(cn => {
      const newChild: Node = {
        id: cn,
        children: [],
      };
      if (caves[cn].isBig) {
        // TODO: Be extra safe and don't visit a Big cave from a Big cave (avoid cycles!)
        node.children.push(newChild);
        if (cn != 'end') {
          queue.push(newChild);
        }
      } else if (!caves[cn].isBig && !caves[cn].has_been_visited_in_this_path) {
// TODO: how to track if the child has been visited in this path?!
        // TODO: don't go to a zero-link small from a small
        node.children.push(newChild);
        if (cn != 'end') {
          queue.push(newChild);
        }
      }
    });
  }


  console.log(`Found (${totalPaths}) total paths through the caves`);
}


day12_1();

