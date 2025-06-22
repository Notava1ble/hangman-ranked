// Required Node.js modules
import fs from "fs";
import path from "path";

// Input and output paths (edit as needed)
const inputPath = path.resolve("./src/data/allWords.txt"); // Change to your .txt file
const outputPath = path.resolve("./src/data/allWords.json");

// Read and convert the file
fs.readFile(inputPath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading input file:", err);
    return;
  }

  const words = data
    .split("\n")
    .map((w) => w.trim())
    .filter(Boolean); // Remove empty lines

  fs.writeFile(outputPath, JSON.stringify(words, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Error writing output file:", err);
    } else {
      console.log(`✅ Successfully saved ${words.length} words to words.json`);
    }
  });
});
