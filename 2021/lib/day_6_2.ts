import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  No additional notes over part 6.1
//  ----
//  The problem doesn't care about individual fish,
//  so group them by their internal clock.
//  Each day, move each cohort 1 step closer to reproduction,
//  then reset the clocks of the adult cohort,
//  and create a new egg cohort.
//
//
// Complexity Analysis:
//  F: initial fish population
//  C: number of distinct clock states
//  D: number of days in the simulation
//
//  Time Complexity:
//    O( F + (D*C) )
//    Process the initial fish population F once at the start,
//    then loop through clock states each day.
//
//  Space complexity:
//    O(F + C)
//    Parse the initial fish population from memory.
//    The source here was a single comma-delimited string,
//    but that could be replaced with an async stream that
//    emits 1 fish at a time to avoid holding the entire
//    starting population in memory.
//
//    After the initial population has been parsed,
//    store one count for each clock state.
//
//
// Total time:  ~2 minutes
//  
//



const SAMPLE_FISH = '3,4,3,1,2';


function getFish(): number[] {
  let rawLine = SAMPLE_FISH;
  if (process.env.SOURCE === 'FULL') {
    const buffInput = fs.readFileSync(path.join(__dirname, 'data/day_6.input.txt'));
    rawLine = buffInput.toString().trim();
  }

  return rawLine
    .trim()
    .split(',')
    .map(strNum => parseInt(strNum, 10));
}


function day6_2(): void {
  console.log('Welcome to Day 6.2. Plenty of fish in the sea, forever...');

  // Load fish from input
  // Populate the array
  // For each day, walk from end to head
  // Sum!

  const MAX_DAYS = 256;
  const DAY_FOR_EGGS = 8;
  const DAY_FOR_RESETS = 6;

  const rawFish = getFish();

  // One counter for each possible fishclock value (0-8)
  const counters = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
  let countResets = 0;

  for (let i = 0; i < rawFish.length; i++) {
    counters[rawFish[i]]++;
  }

  for (let d = 1; d <= MAX_DAYS; d++) {
    console.log(`Day (${d})`);
    console.log(`  start: ${counters.join(', ')}`);
    countResets = counters[0];
    // Start with the fish at 1, move everyone "down" one spot.
    for (let c = 1; c <= counters.length; c++) {
      counters[c-1] = counters[c];
    }
    counters[DAY_FOR_RESETS] += countResets;
    counters[DAY_FOR_EGGS] = countResets;
    console.log(`    end: ${counters.join(', ')}`);
  }

  const totalFish = counters.reduce(
    (sum, pop) => (sum + pop),
    0
  );


  console.log(`There are (${totalFish}) fish after (${MAX_DAYS}) days.`);
}


day6_2();

