const fs = require('fs');
const path = require('path');


function countQuestions(data) {
  let c = 1;
  let hash = { [data[0]]: 1 };
  let sum = 0;

  while (c < data.length) {
    if (data[c] !== '\n') {
      hash[data[c]] = 1;
    } else if (data[(c-1)] === '\n' && data[c] === '\n') {
      sum += Object.keys(hash).length;
      hash = {};
    }
    c++;
  }
  sum += Object.keys(hash).length;
  return sum;
}


function main() {
  const datafile = path.resolve(__dirname, 'day_6.data.txt');
  const allAnswers = fs.readFileSync(datafile, { encoding: 'UTF-8' });

  const sum = countQuestions(allAnswers);
  console.log(`Sum = ${sum}`);
}


main();

