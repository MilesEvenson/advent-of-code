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


