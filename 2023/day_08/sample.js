function getSampleOnePassData() {
  return {
    instructions: 'RL',
    graph: {
      AAA: [ 'BBB', 'CCC' ],
      BBB: [ 'DDD', 'EEE' ],
      CCC: [ 'ZZZ', 'GGG' ],
      DDD: [ 'DDD', 'DDD' ],
      EEE: [ 'EEE', 'EEE' ],
      GGG: [ 'GGG', 'GGG' ],
      ZZZ: [ 'ZZZ', 'ZZZ' ],
    },
  };
};


function getSampleLoopData() {
  return {
    instructions: 'LLR',
    graph: {
      AAA: [ 'BBB', 'BBB' ],
      BBB: [ 'AAA', 'ZZZ' ],
      ZZZ: [ 'ZZZ', 'ZZZ' ],
    },
  };
};


function getSamplePart2Data() {
  return {
    instructions: 'LR',
    graph: {
      '11A': [ '11B', 'XXX' ],
      '11B': [ 'XXX', '11Z' ],
      '11Z': [ '11B', 'XXX' ],
      '22A': [ '22B', 'XXX' ],
      '22B': [ '22C', '22C' ],
      '22C': [ '22Z', '22Z' ],
      '22Z': [ '22B', '22B' ],
      'XXX': [ 'XXX', 'XXX' ],
    },
  };
};


