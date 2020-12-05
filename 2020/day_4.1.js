const fs = require('fs');
const path = require('path');


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

function isValid(chunk) {
  if (chunk.length < 5) {
    return false;
  }

  const fields = getRequiredFields();

  let c = 0;
  while (c < chunk.length) {
    if (chunk[c] === ':') {
      fields[chunk.substring((c-3), c)] = true;
    }
    c++;
  }

  const hasAllRequiredFields = Object.values(fields).reduce(
    (hasAll, exists) => (hasAll && exists),
    true
  );

  return hasAllRequiredFields;
}


function main() {
  const rawData = getRawData();
  const chunks = rawData
    .split(/[\r\n]{2,}/);

  let countValid = 0;
  let i = 0;
  while (i < chunks.length) {
    if (isValid(chunks[i])) {
      countValid++;
    }
    i++;
  }

  console.log(`Found ${countValid} valid passports`);
}

main();

