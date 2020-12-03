const lines = require('./day_2.data');
const OFFSET = 1;


function isPasswordValid(word, char, positionOne, positionTwo) {
  if (word.length < positionOne || word.length < positionTwo) {
    return false;
  }

  const matchAtOne = word[(positionOne - OFFSET)] === char;
  const matchAtTwo = word[(positionTwo - OFFSET)] === char;

  const isValid = (matchAtOne && !matchAtTwo)
    || (!matchAtOne && matchAtTwo);

  return isValid;
}


let validPasswords = 0;

lines.forEach(rawLine => {
  const [
    rawPositions,
    rawChar,
    word
  ] = rawLine.trim().toLowerCase().split(' ');
  const [
    positionOne,
    positionTwo,
  ] = rawPositions.split('-');

  const char = rawChar[0].toLowerCase();

  if (isPasswordValid(word, char, parseInt(positionOne), parseInt(positionTwo))) {
    validPasswords++;
  }
});

console.log(`Found ${validPasswords} valid passwords.`);
