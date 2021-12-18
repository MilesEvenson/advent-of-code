import * as fs from 'fs';
import path from 'path';

const INPUT_FULL = require('./data/day_18.input');


//
// Initial Thoughts:
//
//
// Reflection:
//  Found a couple bugs in my traversal and reducing logic.
//  I also burned a lot of time tracking down pointer behavior
//  that seemed weird at the time, but is obvious in hindsight.
//  Specifically, newObj = { ...oldObj } is not a deep copy.
//    See the note under Copy an array:
//      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals
//
//
//
//


interface Node {
  left: number | Node,
  parent: null | Node,
  right: number | Node,
}


enum Operation {
  EXPLODE = 'explode',
  SPLIT_LEFT = 'split-left',
  SPLIT_RIGHT = 'split-right',
}


interface Instruction {
  op: Operation,
  node: Node,
}


type SnailNumber = number | SnailNumber[];


const SAMPLE_SMALL: SnailNumber[][] = [
    [[[[4,3],4],4],[7,[[8,4],9]]],
  [1,1],
];


const SAMPLE_MEDIUM: SnailNumber[][] = [
  [[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]],
  [7,[[[3,7],[4,3]],[[6,3],[8,8]]]],
  [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]],
  [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]],
  [7,[5,[[3,8],[1,4]]]],
  [[2,[2,2]],[8,[8,1]]],
  [2,9],
  [1,[[[9,3],9],[[9,0],[0,7]]]],
  [[[5,[7,4]],7],1],
  [[[[4,2],2],6],[8,7]],
];


const SAMPLE_LARGE: SnailNumber[][] = [
  [[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]],
  [[[5,[2,8]],4],[5,[[9,9],0]]],
  [6,[[[6,2],[5,6]],[[7,6],[4,7]]]],
  [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]],
  [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]],
  [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]],
  [[[[5,4],[7,7]],8],[[8,3],8]],
  [[9,3],[[9,9],[6,[4,9]]]],
  [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]],
  [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]],
];


function isFull(): boolean {
  return (process.env.SOURCE === 'FULL');
}


function isNumber(n: number | Node): boolean {
  return typeof n == 'number';
}


function getSnailNumbers(): SnailNumber[][] {
  if (process.env.SOURCE === 'SMALL') {
    return SAMPLE_SMALL;
  } else if (process.env.SOURCE === 'MEDIUM') {
    return SAMPLE_MEDIUM;
  } else if (process.env.SOURCE === 'LARGE') {
    return SAMPLE_LARGE;
  } else if (process.env.SOURCE === 'FULL') {
    return INPUT_FULL;
  }

  return SAMPLE_SMALL;
}


function getNodeFromSnailNumber(rawNumber: SnailNumber[]): Node {
  const root: Node = {
    left: 0,
    parent: null,
    right: 0,
  };

  if (typeof rawNumber[0] == 'number') {
    root.left = rawNumber[0];
  } else {
    root.left = getNodeFromSnailNumber(rawNumber[0]);
    root.left.parent = root;
  }

  if (typeof rawNumber[1] == 'number') {
    root.right = rawNumber[1];
  } else {
    root.right = getNodeFromSnailNumber(rawNumber[1]);
    root.right.parent = root;
  }

  return root;
}


function nodeToString(node: Node): string {
  let strLeft: number | string;
  let strRight: number | string;
  if (typeof node.left == 'number') {
    strLeft = node.left;
  } else {
    strLeft = nodeToString(node.left);
  }
  if (typeof node.right == 'number') {
    strRight = node.right;
  } else {
    strRight = nodeToString(node.right);
  }

  return `[${strLeft},${strRight}]`;
}


function addToImmediateLeft(node: Node, newValue: number): void {
  let prev = node;
  let runner = node.parent;

  // go up until there is a left
  while (runner && runner.left == prev) {
    prev = runner;
    runner = runner.parent;
  }

  if (runner) {
    // If the left is a number, update it.
    if (typeof runner.left == 'number') {
      runner.left += newValue;
    } else {
      // go left once
      runner = runner.left;
      // go down right until the left is a number
      while (typeof runner.right != 'number') {
        runner = runner.right;
      }
      runner.right += newValue;
    }
  }
}


function addToImmediateRight(node: Node, newValue: number): void {
  let prev = node;
  let runner = node.parent;

  // go up until there is a right
  while (runner && runner.right == prev) {
    prev = runner;
    runner = runner.parent;
  }

  if (runner) {
    // If the right is a number, update it.
    if (typeof runner.right == 'number') {
      runner.right += newValue;
    } else {
      // go right once
      runner = runner.right;
      // go down left until the left is a number
      while (typeof runner.left != 'number') {
        runner = runner.left;
      }
      runner.left += newValue;
    }
  }
}


function explodeNode(node: Node): void {
  let head = node;
  while (head.parent) {
    head = head.parent;
  }
  addToImmediateLeft(node, node.left as number);
  addToImmediateRight(node, node.right as number);
  const parent = node.parent as Node;
  if (parent.left == node) {
    parent.left = 0;
  } else if (parent.right == node) {
    parent.right = 0;
  }
}


function splitNumber(num: number): Node {
  return {
    left: Math.floor(num / 2),
    parent: null,
    right: Math.ceil(num / 2),
  };
}


function addNodes(left: Node, right: Node): Node {
  const newRoot = {
    left: left,
    parent: null,
    right: right,
  };
  newRoot.left.parent = newRoot;
  newRoot.right.parent = newRoot;
  return newRoot;
}


function calculateMagnitude(node: Node): number {
  let total = 0;
  if (typeof node.left == 'number') {
    total += 3 * node.left;
  } else {
    total += 3 * calculateMagnitude(node.left);
  }
  if (typeof node.right == 'number') {
    total += 2 * node.right;
  } else {
    total += 2 * calculateMagnitude(node.right);
  }
  return total;
}


function reduceRoot(root: Node): void {
  const queue: Instruction[] = [];

  function reduce(node: Node, depth: number): null | Instruction {
    //console.log(`Reducing node at depth (${depth}): ${nodeToString(node)}`);

    // Order of precedence for scenarios for instructions:
    //  - this node is leaf and it needs to be exploded
    //  - a left descendant needs to be exploded
    //  - a right descendant needs to be exploded
    //  - a left descendant needs to be split
    //  - this left needs to be split
    //  - a right descendant needs to be split

    let instLeft = null;
    let instRight = null;
    if (typeof node.left != 'number') {
      instLeft = reduce(node.left, depth+1);
      if (instLeft && instLeft.op == Operation.EXPLODE) {
        return instLeft;
      }
    }

    if (4 <= depth && isNumber(node.left) && isNumber(node.right)) {
      return {
        op: Operation.EXPLODE,
        node: node,
      };
    }

    if (typeof node.right != 'number') {
      instRight = reduce(node.right, depth+1);
    }

    if (instRight && instRight.op == Operation.EXPLODE) {
      return instRight;
    } else if (instLeft) {
      return instLeft;
    } else if (isNumber(node.left) && 9 < node.left) {
      return {
        op: Operation.SPLIT_LEFT,
        node: node,
      };
    } else if (isNumber(node.right) && 9 < node.right) {
      return {
        op: Operation.SPLIT_RIGHT,
        node: node,
      };
    } else if (instRight) {
      return instRight;
    }

    return null;
  }

  let opCount = 0;
  let inst = reduce(root, 0);
  while (inst != null) {
    if (inst.op == Operation.EXPLODE) {
      explodeNode(inst.node as Node);
    } else if (inst.op == Operation.SPLIT_LEFT && typeof inst.node.left == 'number') {
      inst.node.left = splitNumber(inst.node.left);
      inst.node.left.parent = inst.node;
    } else if (inst.op == Operation.SPLIT_RIGHT && typeof inst.node.right == 'number') {
      inst.node.right = splitNumber(inst.node.right);
      inst.node.right.parent = inst.node;
    }
    opCount++;
    inst = reduce(root, 0);
  }

  //console.log(`Processed (${opCount}) instructions.`);
}



function day18_2(): void {
  console.log('Welcome to Day 18.2. Finding the biggest mag.');

  const magnitudes: number[][] = [];
  const snailNumbers = getSnailNumbers();
  const rootNodes = snailNumbers.map(getNodeFromSnailNumber);

  let rowNode: Node;
  let colNode: Node;
  let sumNode: Node;
  let row: number[];
  let loopMag = 0;
  let maxMag = 0;
  let idxMaxRow = 0;
  let idxMaxCol = 0;
 
  if (process.env.SNAILS) {
    const [ strIdxLeft, strIdxRight ] = process.env.SNAILS.split('-');
    const idxLeft = parseInt(strIdxLeft, 10);
    const idxRight = parseInt(strIdxRight, 10);
    const nodeLeft = getNodeFromSnailNumber(snailNumbers[idxLeft]);
    const nodeRight = getNodeFromSnailNumber(snailNumbers[idxRight]);
    const nodeSum = addNodes(nodeLeft, nodeRight);
    console.log('Added:');
    console.log(nodeToString(nodeLeft));
    console.log(nodeToString(nodeRight));
    console.log('Raw Sum:');
    console.log(nodeToString(nodeSum));
    reduceRoot(nodeSum);
    console.log('Reduction:');
    console.log(nodeToString(nodeSum));
    const mag = calculateMagnitude(nodeSum);
    console.log(`Magnitude: ${mag}`);
  } else {
    for (let r = 0; r < rootNodes.length; r++) {
      //console.log(`Will calc mags for snail (${r}): ${snailNumbers[r]}`);
      row = [];
      for (let c = 0; c < rootNodes.length; c++) {
        if (r != c) {
          //console.log(`  adding snail (${c}): ${snailNumbers[c]}`);
          rowNode = getNodeFromSnailNumber(snailNumbers[r]);
          colNode = getNodeFromSnailNumber(snailNumbers[c]);
          sumNode = addNodes(rowNode, colNode);
          reduceRoot(sumNode);
          loopMag = calculateMagnitude(sumNode);
          row.push(loopMag);
          if (maxMag < loopMag) {
            maxMag = loopMag;
            idxMaxRow = r;
            idxMaxCol = c;
          }
        }
      }
      magnitudes.push(row);
    }

    console.log('All the Mags:');
    magnitudes.forEach(row => console.log(row.join(' ')));

    rowNode = getNodeFromSnailNumber(snailNumbers[idxMaxRow]);
    colNode = getNodeFromSnailNumber(snailNumbers[idxMaxCol]);

    console.log(`Row snail (${idxMaxRow}) for max mag:`);
    console.log(nodeToString(rowNode));
    console.log(`Column snail (${idxMaxCol}) for max mag:`);
    console.log(nodeToString(colNode));
    console.log('Result of row + column snails:');
    const finalNode = addNodes(rowNode, colNode);
    reduceRoot(finalNode);
    console.log(nodeToString(finalNode));

    console.log(`Found a max magnitude of (${maxMag})`);
  }
}


day18_2();

