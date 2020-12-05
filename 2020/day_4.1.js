const fs = require('fs');
const path = require('path');


const CHAR_a = 97;
const CHAR_z = 122;

function getRawData() {
  const datafile = path.resolve(__dirname, 'day_4.data.txt');
  const rawData = fs.readFileSync(datafile, { encoding: 'UTF-8' });
  return rawData;
}

function getRequiredFields() {
  return {
    byr: false,
    iyr: false,
    eyr: false,
    hgt: false,
    hcl: false,
    ecl: false,
    pid: false,
  };
}


function main() {
  const rawData = getRawData();

  let countValid = 0;

  let c = 1;
  let fields = {};
  let inSequence = false;
  let hasAllRequiredFields = false;

  while (c < rawData.length) {
    if (!inSequence && CHAR_a <= rawData.charCodeAt(c) && rawData.charCodeAt(c) <= CHAR_z) {
      inSequence = true;
      fields = getRequiredFields();
    } else if (rawData[c] === ':') {
      fields[rawData.substring((c-3), c)] = true;
    } else if (inSequence
      && (rawData[c-1] === '\n' || rawData[c-1] === '\r')
      && (rawData[c] === '\n' || rawData[c] === '\r')
    ) {
      inSequence = false;
      hasAllRequiredFields = Object.values(fields).reduce(
        (hasAll, exists) => (hasAll && exists),
        true
      );
      if (hasAllRequiredFields) {
        countValid++;
      }
    }

    c++;
  }
  if (inSequence) {
    hasAllRequiredFields = Object.values(fields).reduce(
      (hasAll, exists) => (hasAll && exists),
      true
    );
    if (hasAllRequiredFields) {
      countValid++;
    }
  }

  console.log(`Found ${countValid} valid passports`);
}

main();

