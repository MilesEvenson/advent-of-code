import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  Breadth-first search through the graph to build a trie(ish?)
//  of the various paths. I think this worked okay, but I really
//  do not like passing the dict down through the trie. I'd initially
//  thought it would allow me to avoid O(N) traversal of the preceding
//  nodes in the path, but I have to clone the dictionary at each branch,
//  which is an O(N) operation anyways :(
//
//
//  Seriously! Start with a class tomorrow for simpler global-ish state!
//  
//
// Complexity Analysis:
//  P: total distinct paths
//  L: length of the longest distinct path
//
//  Time Complexity:
//    O(P * L)
//    Process each node, each time it is in a path.
//
//  Space complexity:
//    O(P * L)
//    Store a node for each cave in each path.
//
//
// Total time:   ~115 minutes
//  Planning      25
//  Programming   90
//  Debugging     xx
//                Forgot to split out debugging for 12.1
//
//  Some light distraction while working on this solution related to Formula 1.
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
    const buffInput = fs.readFileSync(path.join(__dirname, 'data', 'day_12.input.txt'));
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
}


interface Node {
  children: Node[];
  id: string;
  visitedSmalls: Record<string, string>;
}


function loadCaves(): Record<string, Cave> {
  const lines = getLines();
  return lines.reduce(
    (dict, rawLine): Record<string, Cave> => {
      const [ idSource, idDest ] = rawLine.split('-');

      const caveSource: Cave = {
        id: idSource,
        isBig: (65 <= idSource.charCodeAt(0) && idSource.charCodeAt(0) <= 90),
        links: [],
      };
      const caveDest: Cave = {
        id: idDest,
        isBig: (65 <= idDest.charCodeAt(0) && idDest.charCodeAt(0) <= 90),
        links: [],
      };

      if (!dict.hasOwnProperty(idSource)) {
        dict[idSource] = caveSource;
      }
      if (!dict.hasOwnProperty(idDest)) {
        dict[idDest] = caveDest;
      }

      dict[idSource].links.push(caveDest);
      dict[idDest].links.push(caveSource);

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
    visitedSmalls: {},
  };
  const queue: Node[] = [ root ];
  let node: Node;

  // while queue has nodes
  while (0 < queue.length) {
    // shift off the next node
    node = queue.shift() as Node;

    caves[node.id].links.forEach(caveNext => {
      const newChild: Node = {
        id: caveNext.id,
        children: [],
        visitedSmalls: { ...node.visitedSmalls },
      };

      if (!caves[node.id].isBig) {
        newChild.visitedSmalls[node.id] = node.id;
      }

      // Only proceed to a Big cave from a small cave to avoid a Big-Big cycle.
      if (caves[caveNext.id].isBig && !caves[node.id].isBig) {
        node.children.push(newChild);
        if (caveNext.id != 'end') {
          queue.push(newChild);
        } else {
          totalPaths++;
        }
      } else if (
        !caves[caveNext.id].isBig
        && !node.visitedSmalls.hasOwnProperty(caveNext.id)
        && (
          caves[node.id].isBig
          || 1 < caves[caveNext.id].links.length
        )
      ) {
        node.children.push(newChild);
        if (caveNext.id != 'end') {
          queue.push(newChild);
        } else {
          totalPaths++;
        }
      }
    });
    node.visitedSmalls = {};
  }

  //console.dir(root, { depth: null, maxArrayLength: null });


  console.log(`Found (${totalPaths}) total paths through the caves`);
}


day12_1();

