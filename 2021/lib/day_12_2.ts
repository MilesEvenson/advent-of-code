import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  I didn't like passing the dict of processed caves
//  down through the trie for 12.1 so I decided to try
//  a depth-first stack-based approach for 12.2.
//  At a high level, my goal was for the ids in the stack
//  to describe a distinct path (i.e. NOT the traditional
//  approach for DFS with a stack).
//  This seemed like a good idea initially, but I did not
//  spend enough time planning out the algorithm *in detail*
//  and I ended up spending SO LONG writing and debugging :(
//
//  Implementing iterative DFS with a stack required a lot of logic
//  (e.g. popping up to a branch switch) to make up for the lack
//  of state to provide context. Remember this for future iterative
//  approaches and compose a more detailed plan!
//
//  In hindsight, I should have just enhanced my solution for 12.1,
//  and *then* tried to re-write it with a stack :(
//
//  I missed this requirement initially (oof)
//    a single small cave can be visited at most twice,
//    and the remaining small caves can be visited at most once.
//  Luckily, it didn't take too long to address (albeit in an ugly way).
//
//
//  Seriously! Start with a class tomorrow for simpler global-ish state!
//
//  Also! Spend more time preparing a detailed plan! Especially for
//  algorithms I'm not as familiar with!
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
// Total time: way over par on this one :(
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
  visits: number;
}


interface Node {
  id: string;
  index: number;
}


function loadCaves(): Record<string, Cave> {
  const lines = getLines();
  return lines.reduce(
    (dict, rawLine): Record<string, Cave> => {
      const [ idLeft, idRight ] = rawLine.split('-');

      const caveLeft: Cave = {
        id: idLeft,
        isBig: (65 <= idLeft.charCodeAt(0) && idLeft.charCodeAt(0) <= 90),
        links: [],
        visits: 0,
      };
      const caveRight: Cave = {
        id: idRight,
        isBig: (65 <= idRight.charCodeAt(0) && idRight.charCodeAt(0) <= 90),
        links: [],
        visits: 0,
      };

      if (!dict.hasOwnProperty(idLeft)) {
        dict[idLeft] = caveLeft;
      }
      if (!dict.hasOwnProperty(idRight)) {
        dict[idRight] = caveRight;
      }

      if (idLeft == 'start') {
        dict[idLeft].links.push(caveRight);
      } else if (idLeft == 'end') {
        dict[idRight].links.push(caveLeft);
      } else if (idRight == 'start') {
        dict[idRight].links.push(caveLeft);
      } else if (idRight == 'end') {
        dict[idLeft].links.push(caveRight);
      } else {
        dict[idLeft].links.push(caveRight);
        dict[idRight].links.push(caveLeft);
      }

      return dict;
    },
    {} as Record<string, Cave>
  );
}


function day12_2(): void {
  console.log('Welcome to Day 12.2. Small caves are cool too.');

  
  // I did not like my breadth-first search approach in 12.1.
  // Could a depth-first search work better?
  // Use a stack and pre-order traversal
  //
  //  starting right (links.length-1)
  //    if link == end
  //      log a chain
  //    else
  //      push a child onto stack
  //  


  function canVisit(currentId: string, nextId: string): boolean {
    let smallVisitCap = 2;
    if (repeatSmallVisitExists) {
      smallVisitCap = 1;
    }

    if (currentId == nextId) {
      return false;
    }

    if (nextId == 'end') {
      return true;
    } else if (caves[nextId].isBig) {
      return true;
    } else if (
      !caves[nextId].isBig
      && caves[nextId].visits < smallVisitCap
      && (
        caves[currentId].isBig
        || (
          !caves[currentId].isBig
          && (
            caves[currentId].visits < smallVisitCap
            || 1 < caves[nextId].links.length
          )
        )
      )
    ) {
      return true;
    }
    return false;
  }


  const caves = loadCaves();

  const root: Node = {
    id: 'start',
    index: -1,
  };

  const stack: Node[] = [ root ];
  let node: Node;
  let tip = stack.length - 1;
  //const paths: string[] = [];
  let totalPaths = 0;
  let remainingLinks = 0;
  let nextId = '';
  let nextIndex = -1;
  let deadEnd = false;
  let repeatSmallVisitExists = false;

  while (0 < stack.length) {
    nextId = '';
    nextIndex = -1;
    deadEnd = false;

    if (!caves[stack[tip].id].isBig && stack[tip].id != 'end') {
      caves[stack[tip].id].visits++;
      if (2 <= caves[stack[tip].id].visits) {
        repeatSmallVisitExists = true;
      }
    }

    if (stack[tip].id == 'end') {
      deadEnd = true;
      //paths.push(stack.map(n => n.id).join(', '));
      totalPaths++;
    } else {
      nextIndex = caves[stack[tip].id].links.length - 1;
      while (0 <= nextIndex) {
        nextId = caves[stack[tip].id].links[nextIndex].id;
        if (canVisit(stack[tip].id, nextId)) {
          break;
        }
        nextIndex--;
      }
      if (0 <= nextIndex) {
        nextId = caves[stack[tip].id].links[nextIndex].id;
      } else {
        deadEnd = true;
      }
    }

    if (deadEnd) {
      node = stack.pop() as Node;
      tip--;
      remainingLinks = node.index;
      nextIndex = node.index - 1;
      while (0 <= nextIndex) {
        nextId = caves[stack[tip].id].links[nextIndex].id;
        if (canVisit(stack[tip].id, nextId)) {
          break;
        }
        remainingLinks--;
        nextIndex--;
      }

      while (node.index == 0 || remainingLinks == 0) {
        node = stack.pop() as Node;
        tip--;

        if (!caves[node.id].isBig && node.id != 'end') {
          caves[node.id].visits--;
          if (caves[node.id].visits == 1) {
            repeatSmallVisitExists = false;
          }
        }

        remainingLinks = node.index;
        nextIndex = node.index - 1;

        while (0 <= nextIndex) {
          nextId = caves[stack[tip].id].links[nextIndex].id;
          if (canVisit(stack[tip].id, nextId)) {
            break;
          }
          remainingLinks--;
          nextIndex--;
        }
      }
    }

    if (0 <= nextIndex) {
      stack.push({
        id: nextId,
        index: nextIndex,
      });
      tip++;
    }

  } // end - stack loop

  //paths
  //  .sort()
  //  .forEach(p => console.dir(p));

  console.log(`Found (${totalPaths}) total paths through the caves`);
}


day12_2();

