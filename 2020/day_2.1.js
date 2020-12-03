const lines = require('./day_2.data');

let validPasswords = 0;


function isPasswordValid(word, char, countMin, countMax) {
  let i = 0;
  let count = 0;
  while (i < word.length) {
    if (word[i] === char) {
      count++;
    }
    i++;
  }
  const isValid = (countMin <= count && count <= countMax);
  if (!isValid) {
  }

  return isValid;
}


lines.forEach(rawLine => {
  const [
    rawMinMax,
    rawChar,
    word
  ] = rawLine.trim().toLowerCase().split(' ');
  const [
    countMin,
    countMax
  ] = rawMinMax.split('-');

  const char = rawChar[0].toLowerCase();

  if (isPasswordValid(word, char, parseInt(countMin), parseInt(countMax))) {
    validPasswords++;
  }
});

console.log(`Found ${validPasswords} valid passwords.`);
