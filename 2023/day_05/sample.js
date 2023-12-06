function getSampleData() {
  return {
    seeds: [ 79, 14, 55, 13 ],

    maps: [
      {
        slug: 'seed-to-soil',
        rangeLines: [
          '50 98 2',
          '52 50 48',
        ],
      },
      {
        slug: 'soil-to-fertilizer',
        rangeLines: [
          '0 15 37',
          '37 52 2',
          '39 0 15',
        ],
      },
      {
        slug: 'fertilizer-to-water',
        rangeLines: [
          '49 53 8',
          '0 11 42',
          '42 0 7',
          '57 7 4',
        ],
      },
      {
        slug: 'water-to-light',
        rangeLines: [
          '88 18 7',
          '18 25 70',
        ],
      },
      {
        slug: 'light-to-temperature',
        rangeLines: [
          '45 77 23',
          '81 45 19',
          '68 64 13',
        ],
      },
      {
        slug: 'temperature-to-humidity',
        rangeLines: [
          '0 69 1',
          '1 0 69',
        ],
      },
      {
        slug: 'humidity-to-location',
        rangeLines: [
          '60 56 37',
          '56 93 4',
        ],
      },
    ],
  };
};

