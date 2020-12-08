const fs = require('fs');
const path = require('path');


function countUnanimousQuestions(data) {
  let c = 1;
  let groupSize = 0;
  let groupSum = 0;
  let hash = { [data[0]]: 1 };
  let sum = 0;

  while (c < data.length) {
    if (data[c] !== '\n') {
      if (!hash.hasOwnProperty(data[c])) {
        hash[data[c]] = 0;
      }
      hash[data[c]]++;
    } else if (data[(c-1)] !== '\n' && data[c] === '\n') {
      groupSize++;
    } else if (data[(c-1)] === '\n' && data[c] === '\n') {
      groupSum = Object.values(hash).reduce(
        (total, count) => {
          if (count === groupSize) {
            return total + 1;
          }
          return total;
        },
        0
      );
      sum += groupSum;
      groupSize = 0;
      hash = {};
    }
    c++;
  }

  if (data[c-1] !== '\n') {
    groupSize++;
  }
  groupSum = Object.values(hash).reduce(
    (total, count) => {
      if (count === groupSize) {
        return total + 1;
      }
      return total;
    },
    0
  );
  sum += groupSum;

  return sum;
}


function main() {
  const datafile = path.resolve(__dirname, 'day_6.data.txt');
  const allAnswers = fs.readFileSync(datafile, { encoding: 'UTF-8' });

  const sum = countUnanimousQuestions(allAnswers);
  console.log(`Sum = ${sum}`);
}


main();

