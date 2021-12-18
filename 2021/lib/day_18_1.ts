import * as fs from 'fs';
import path from 'path';

const INPUT_FULL = require('./data/day_18.input');


//
// Initial Thoughts:
//  This feels like a situation that calls for recursion.
//  What would the explode operation look like in a tree?
//    - Find immediate left neighbor, add to it
//    - Find immediate right neighbor, add to it
//    - Move up to parent, replace with regular 0
//  Mabye?
//
//  Can I do string operations?
//  Replacing is unwieldy in strings.
//  Finding the next regular number is *easy* though.
//
//
//  Do I know a pattern for keeping  a reference to
//  a node while also going "up and over" in a tree?
//  I don't think so.
//  What if each node has a reference to its parent?
//  Probably better.
//  What does findImmediateLeft() look like?
//    - go up until node.left or at root
//    - go down left once
//    - go down until node.right is regular number
//
//
// First idea:
//  Tree where nodes have a reference to their parent
//  to allow for easier traversal.
//  --> WORKS AS EXPECTED
//  --> FEELS GOOD TO HAVE A SMOOTH EXPERIENCE AFTER A ROUGH COUPLE DAYS
//
//
//
//
//
//


const C_RESET = '\x1b[0m';


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


// [   [ [ [4,3], 4 ], 4 ],   [ 7, [ [8,4], 9 ] ]   ],
const SAMPLE_SMALL: SnailNumber[][] = [
  [
    [
      [
        [4,3],
        4
      ],
      4
    ],
    [
      7,
      [
        [8,4],
        9
      ]
    ]
  ],
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


function getNumbers(): SnailNumber[][] {
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
    console.log(`Reducing node at depth (${depth}): ${nodeToString(node)}`);
    // Order of precedence for scenarios for instructions:
    //  - this node is leaf and it needs to be exploded
    //  - a left descendant needs to be exploded
    //  - a right descendant needs to be exploded
    //  - a left descendant needs to be split
    //  - this left needs to be split
    //  - a right descendant needs to be split

    if (4 <= depth && isNumber(node.left) && isNumber(node.right)) {
      console.log('  creating EXPLODE instruction');
      return {
        op: Operation.EXPLODE,
        node: node,
      };
    }

    let instLeft = null;
    let instRight = null;
    if (typeof node.left != 'number') {
      instLeft = reduce(node.left, depth+1);
      if (instLeft && instLeft.op == Operation.EXPLODE) {
        return instLeft;
      }
    }

    if (typeof node.right != 'number') {
      instRight = reduce(node.right, depth+1);
    }

    if (instRight && instRight.op == Operation.EXPLODE) {
      return instRight;
    } else if (instLeft) {
      return instLeft;
    } else if (isNumber(node.left) && 9 < node.left) {
      console.log('  creating SPLIT_LEFT instruction');
      return {
        op: Operation.SPLIT_LEFT,
        node: node,
      };
    } else if (isNumber(node.right) && 9 < node.right) {
      console.log('  creating SPLIT_RIGHT instruction');
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

  console.log(`Processed (${opCount}) instructions.`);
}



function day18_1(): void {
  console.log('Welcome to Day 18.1. Maybe too much nesting?');

  const numbers = getNumbers();
  let root = getNodeFromSnailNumber(numbers.shift() as SnailNumber[][]);
  let loopNode: Node;
  for (const snail of numbers) {
    loopNode = getNodeFromSnailNumber(snail);
    console.log('Adding:')
    console.log(nodeToString(root));
    console.log(nodeToString(loopNode));
    root = addNodes(root, loopNode);
    console.log('Got:');
    console.log(nodeToString(root));
    console.log('Reducing');
    reduceRoot(root);
    console.log('Fully reduced:');
    console.log(nodeToString(root) + '\n\n');
  }

  const magnitude = calculateMagnitude(root); 
  console.log(`Not too much nesting. Calculated a magnitude of (${magnitude})`);
}


day18_1();

