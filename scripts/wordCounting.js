import words from "../src/data/allWords.js"

export function countWords(length) {
  let count = 0;
  for (const word of words) {
    if (word.length >= length) {
      count++;
    }
  }
  return count;
}

console.log(`Number of words with length >= 5: ${countWords(6)}`);
