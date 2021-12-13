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

    console.log(`      current cave (${currentId}) ${(caves[currentId].isBig ? 'is' : 'is not')} big and has (${caves[currentId].visits}) visits and has (${caves[currentId].links.length}) links.`);
    console.log(`      next cave (${nextId}) ${(caves[nextId].isBig ? 'is' : 'is not')} big and has (${caves[nextId].visits}) visits and has (${caves[nextId].links.length}) links.`);
    console.log(`      smallVisitCap (${smallVisitCap})`);

    if (currentId == nextId) {
      console.log('        no, cannot visit self');
      return false;
    }

    if (nextId == 'end') {
      console.log('        yes');
      return true;
    } else if (caves[nextId].isBig) {
      console.log('        yes');
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
      console.log('        yes');
      return true;
    }
    console.log('        no');
    return false;
  }


  const caves = loadCaves();

  let totalPaths = 0;

  const root: Node = {
    id: 'start',
    index: -1,
  };

  const stack: Node[] = [
    root,
    // Hack to get the stack started. May not be necessary?
    {
      id: caves[root.id].links[caves[root.id].links.length-1].id,
      index: caves[root.id].links.length - 1,
    },
  ];
  let node: Node;
  let tip = stack.length - 1;
  const paths: string[] = [];
  let remainingLinks = 0;
  let nextId = '';
  let nextIndex = -1;
  let deadEnd = false;
  let repeatSmallVisitExists = false;

  while (0 < stack.length) {
    console.log('\n\n');
    console.log(stack.map(n => `(${n.id}, ${n.index}, ${caves[n.id].visits})`).join(', '));
    //node = stack[tip];
    nextId = '';
    nextIndex = -1;
    deadEnd = false;

    if (!caves[stack[tip].id].isBig && stack[tip].id != 'end') {
      caves[stack[tip].id].visits++;
      console.log(`Processing (${stack[tip].id}). This is visit (${caves[stack[tip].id].visits}).`);
      if (2 <= caves[stack[tip].id].visits) {
        repeatSmallVisitExists = true;
        console.log('  there is now a repeat small visit on record');
      }
    }


    if (stack[tip].id == 'end') {
      deadEnd = true;
      paths.push(stack.map(n => n.id).join(', '));
      console.log(`  Found an exit. Backtracking`);
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
        console.log(`  Cave (${stack[tip].id}, ${stack[tip].index}, ${caves[stack[tip].id].visits}) is a dead end. Backtracking.`);
        deadEnd = true;
      }
    }

    if (deadEnd) {
      // Hacky way to get out of the stack processing loop.
      //if (stack.length == 1) {
      //  break;
      //}
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

      //console.log(`    Starting backtrack with node (${node.id}, ${node.index}, ${caves[node.id].visits}), next (${nextId} ${nextIndex} ${caves[nextId].visits}), remainingLinks (${remainingLinks})`);

      while (node.index == 0 || remainingLinks == 0) {
        console.log('    (' + remainingLinks + ') ' + stack.map(n => `{${n.id}, ${n.index}, ${caves[n.id].visits}}`).join(', '));
        node = stack.pop() as Node;
        tip--;

        if (!caves[node.id].isBig && node.id != 'end') {
          caves[node.id].visits--;
          console.log(`Popping (${node.id}). It now has visits (${caves[node.id].visits}).`);
          if (caves[node.id].visits == 1) {
            console.log('  Popped a repeat visit. There is not a repeat small visit on record.');
            repeatSmallVisitExists = false;
          }
        }

        remainingLinks = node.index;
        nextIndex = node.index - 1;

        while (0 <= nextIndex) {
          nextId = caves[stack[tip].id].links[nextIndex].id;
          if (canVisit(stack[tip].id, nextId)) {
            console.log(`      can visit (${nextId}, ${nextIndex}, ${caves[nextId].visits})`);
            break;
          }
          remainingLinks--;
          nextIndex--;
        }
        //console.log(`      Finished checking links from (${stack[tip].id}). nextIndex (${nextIndex}), remainingLinks (${remainingLinks})`);
      }
      console.log('    ' + stack.map(n => `[${n.id}, ${n.index}, ${caves[n.id].visits}]`).join(', '));
    }



    if (0 <= nextIndex) {
      //console.log(`  will move to: (${nextId}, ${nextIndex}, ${caves[nextId].visits})`);
      stack.push({
        id: nextId,
        index: nextIndex,
      });
      tip++;
    }

  } // end - stack loop

  paths
    .sort()
    .forEach(p => console.dir(p));

  console.log(`Found (${paths.length}) total paths through the caves`);
}


day12_2();

