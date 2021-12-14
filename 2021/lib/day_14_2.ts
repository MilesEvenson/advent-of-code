import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  
//
// Complexity Analysis:
//
//  Time Complexity, 13.1:
//
//  Space complexity:
//
//
// Total time,    ????  minutes
//  Planning       ??
//  Programming    ??
//  Debugging      ??
//
//
//
//


const SAMPLE_POLYMER = 'NNCB';
const FULL_POLYMER = 'SCSCSKKVVBKVFKSCCSOV';


const SAMPLE_INSTRUCTIONS = [
  'CH -> B',
  'HH -> N',
  'CB -> H',
  'NH -> C',
  'HB -> C',
  'HC -> B',
  'HN -> C',
  'NN -> C',
  'BH -> H',
  'NC -> B',
  'NB -> B',
  'BN -> B',
  'BB -> N',
  'BC -> B',
  'CC -> N',
  'CN -> C',
];


interface Node {
  element: string;
  next: Node | null;
}


function getRawPolymer(): string {
  let rawMolecule = SAMPLE_POLYMER;
  if (process.env.SOURCE === 'FULL') {
    rawMolecule = FULL_POLYMER;
  }

  return rawMolecule;
}


function getRawInstructions(): string[] {
  let rawLines = SAMPLE_INSTRUCTIONS;
  if (process.env.SOURCE === 'FULL') {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data', 'day_14.input.instructions.txt'));
    rawLines = buffInput.toString()
      .trim()
      .split('\n');
  }

  return rawLines;
}


function parseInstructions(rawLines: string[]): Record<string, string> {
  return rawLines.reduce(
    (dict, line) => {
      const [
        pair,
        element,
      ] =line.trim().split(' -> ');
      dict[pair] = element;
      return dict;
    },
    {} as Record<string, string>
  );
}


function parsePolymer(polymer: string): Node {
  let head: Node = {
    element: '',
    next: null,
  };
  let node: Node = {
    element: polymer[0],
    next: null,
  };
  head.next = node;
  for (let i = 1; i < polymer.length; i++) {
    node.next = {
      element: polymer[i],
      next: null,
    };
    node = node.next;
  }
  return head;
}


function polymerToString(head: Node): string {
  let curr = head.next;
  let str = '';
  while (curr != null) {
    str = str + curr.element;
    curr = curr.next;
  }
  return str;
}


function day14_2(): void {
  console.log('Welcome to Day 14.2. Building really really long chains, efficientl.');

  // A linked list won't cut it now that we expect the final polymer
  // to contain a maximum of 2^39 elements.
  //
  // From the prompt, sample input yields these max/min counts:
  // B:   2 192 039 569 602
  // H:       3 849 876 073
  //
  // First idea:
  //  Simple jpeg-style compression
  //  Could this work?
  //  Afer reviewing FULL output from 14.1, I don't think so.
  //  There are few sequences of more than two repeated elements,
  //  so simple (H appears 10 times) tuples won't provide much compression.
  //
  // More thinking
  //
  // The state of a given index on a given step is deterministic.
  // There are 3 pairs in the initial polymer: NNCB.
  // I can "expand" NN as much as I want without affecting following pairs
  // because all the expansion happens between N and N. I know that the next
  // pair to expand will always be NC.
  //
  // How can I generalize this?
  // Identify upper bound on how much I can hold in memory,
  // then expand to chunks of that size.
  // I know the final FULL polymer will have a max length of 2^45.
  // (the FULL template polymer is already on the order of 2^5 with 20 elements)
  // Cap chunk length at 2^30 (~1gb)?
  // That yields a max of 2^15 chunks to process.
  //
  // There are (N^2 / 2) ordered pairs



  const STEP_COUNT = 10;

  // Read molecule into a linked list
  const head = parsePolymer(getRawPolymer());
  // Read instructions into dictionary
  const instructions = parseInstructions(getRawInstructions());
  // Initialize dict for tracking per-element counts
  let elementCounts: Record<string, number> = {};

  let prev: Node;
  let curr: Node | null;
  let newElement = '';

  for (let s = 0; s < STEP_COUNT; s++) {
    prev = head.next as Node;
    curr = head?.next?.next as Node;

    elementCounts = {
      [prev.element]: 1,
    };

    // traverse with prev and curr "nodes"
    while (curr != null) {
      if (!elementCounts.hasOwnProperty(curr.element)) {
        elementCounts[curr.element] = 0;
      }
      elementCounts[curr.element]++;

      newElement = instructions[prev.element + curr.element];
      // if (prev, curr) matches a rule, 
      if (newElement) {
        //  insert new element after prev
        prev.next = {
          element: newElement,
          next: curr,
        };
        //  update counts for new element
        if (!elementCounts.hasOwnProperty(newElement)) {
          elementCounts[newElement] = 0;
        }
        elementCounts[newElement]++;
        prev = prev.next;
      }

      curr = curr.next;
      prev = prev.next as Node;
    }
  }

  console.log(`Executed (${STEP_COUNT}) steps.`);

  console.log(polymerToString(head));
  console.dir(elementCounts);

  let minCount = Number.MAX_SAFE_INTEGER;
  let minElement = '';
  let maxCount = 0;
  let maxElement = '';

  for (const [ element, count ] of Object.entries(elementCounts)) {
    if (count < minCount) {
      minCount = count;
      minElement = element;
    }
    if (maxCount < count) {
      maxCount = count;
      maxElement = element;
    }
  }

  const finalDifference = maxCount - minCount;

  console.log(`Found least common element (${minElement}) with (${minCount}) instances.`);
  console.log(`Found most common element (${maxElement}) with (${maxCount}) instances.`);
  console.log(`Difference is (${finalDifference})`);
}


day14_2();

